"use client";
/**
 * components/DataLoader.tsx
 * Production deck.gl viewer for Bible3D — Narrative Scrubber Edition v2.
 * Cinematic evolution with shareable URLs, related events, keyboard nav, GPU instancing.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, X, Search, BookOpen, Map as MapIcon, Menu, Share2, Sparkles, Navigation } from "lucide-react";
import { tableFromIPC, Table } from "apache-arrow";
import DeckGL from "@deck.gl/react";
import { type PickingInfo, LightingEffect, AmbientLight, DirectionalLight } from "@deck.gl/core";
import { ScatterplotLayer, PathLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { DataFilterExtension, CollisionFilterExtension } from "@deck.gl/extensions";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const POINTS_URL = "/bible-points.parquet?v=" + Date.now();
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const SPEED = 80;

const BIBLICAL_QUOTES = [
  "In the beginning God created the heavens and the earth. - Genesis 1:1",
  "Be still, and know that I am God. - Psalm 46:10",
  "For God so loved the world, that he gave his only Son. - John 3:16",
  "The Lord is my shepherd; I shall not want. - Psalm 23:1",
  "I can do all things through him who strengthens me. - Philippians 4:13",
  "Your word is a lamp to my feet and a light to my path. - Psalm 119:105",
];

const EPOCHS = [
  { id: 0, name: "Creation & Patriarchs", description: "From Eden to the descent into Egypt", hash: "#genesis" },
  { id: 1, name: "Exodus & Conquest",     description: "Moses, Sinai, and the Promised Land", hash: "#exodus"  },
  { id: 2, name: "Judges & Kings",        description: "From Joshua to the divided kingdom",  hash: "#kings"   },
  { id: 3, name: "Exile & Return",        description: "Babylon to the Second Temple",        hash: "#exile"   },
  { id: 4, name: "Intertestamental",      description: "Silence between the Testaments",      hash: "#inter"   },
  { id: 5, name: "Jesus & Early Church",  description: "Gospels to the end of Acts",          hash: "#gospels" },
];

const CANONICAL_BOOK_ORDER = [
  "GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA",
  "1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO",
  "ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO",
  "OBA","JON","MIC","NAH","HAB","ZEP","HAG","ZEC","MAL",
  "MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH",
  "PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS",
  "1PE","2PE","1JO","2JO","3JO","JUD","REV",
];

const TYPE_COLORS: Record<string, [number, number, number, number]> = {
  battle:   [220,  50,  47, 220],
  journey:  [ 38, 139, 210, 200],
  prophecy: [133, 153,   0, 200],
  miracle:  [203,  75,  22, 220],
  birth:    [108, 113, 196, 200],
  death:    [101, 123, 131, 180],
  covenant: [181, 137,   0, 220],
  building: [ 42, 161, 152, 200],
  general:  [147, 161, 161, 160],
};
const DEFAULT_COLOR: [number, number, number, number] = [147, 161, 161, 160];

// Enhanced curated content structure for emotional engagement
interface CuratedEvent {
  id: string;
  summary: string; // 2-3 compelling sentences
  keyVerse: {
    text: string;
    reference: string;
  };
  whyItMatters: string; // 1 sentence devotional reflection
  tags: string[]; // Thematic tags
  audioUrl?: string; // Path to narration MP3
}

const CURATED_CONTENT: Record<string, CuratedEvent> = {
  'creation': {
    id: 'creation',
    summary: "Out of formless void and darkness, God speaks light, sky, seas, and land into being. Over six days, the cosmos takes shape—stars above, creatures below, and humanity crowned as image-bearers. On the seventh day, God rests, establishing a rhythm of work and worship.",
    keyVerse: {
      text: "In the beginning God created the heavens and the earth.",
      reference: "Genesis 1:1"
    },
    whyItMatters: "Creation reveals God as intentional designer who brings order from chaos and invites humanity into partnership.",
    tags: ["creation", "beginnings", "image-of-god", "sabbath"]
  },
  'noahs-flood': {
    id: 'noahs-flood',
    summary: "God judges a corrupt world with a catastrophic flood, yet preserves Noah's family and animal pairs in the ark. After 40 days of rain and 150 days of flooding, God establishes a covenant marked by the rainbow—a promise never to destroy the earth by flood again.",
    keyVerse: {
      text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.",
      reference: "Genesis 9:13"
    },
    whyItMatters: "The flood narrative reveals both God's justice against sin and His mercy in preserving a remnant—foreshadowing the ultimate salvation through Christ.",
    tags: ["judgment", "mercy", "covenant", "noah"]
  },
  'abrahamic-covenant': {
    id: 'abrahamic-covenant',
    summary: "At 75, Abram leaves his homeland trusting God's promise of descendants as numerous as stars. God establishes an everlasting covenant—land, offspring, and blessing to all nations through his line. This wandering Aramean becomes father of faith.",
    keyVerse: {
      text: "I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing.",
      reference: "Genesis 12:2"
    },
    whyItMatters: "Abraham's call launches God's redemptive plan to bless all peoples, finding ultimate fulfillment in Christ.",
    tags: ["faith", "covenant", "promise", "blessing"]
  },
  'joseph-egypt': {
    id: 'joseph-egypt',
    summary: "Betrayed by jealous brothers and sold into slavery, Joseph endures prison before rising to power in Egypt. His God-given wisdom saves nations from famine, including the very brothers who wronged him. What they meant for evil, God intended for good.",
    keyVerse: {
      text: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
      reference: "Genesis 50:20"
    },
    whyItMatters: "Joseph's story reveals God's sovereignty in suffering and His power to transform betrayal into redemption.",
    tags: ["providence", "forgiveness", "suffering", "sovereignty"]
  },
  'exodus-red-sea': {
    id: 'exodus-red-sea',
    summary: "Trapped between Pharaoh's chariots and the sea, Israel cries out in terror. God parts the waters with a strong east wind, creating dry ground through the deep. The Egyptians pursue but are drowned when the waters return—Yahweh fights for His people.",
    keyVerse: {
      text: "The Lord will fight for you; you need only to be still.",
      reference: "Exodus 14:14"
    },
    whyItMatters: "The Red Sea deliverance becomes Israel's defining salvation story, foreshadowing Christ's victory over sin and death.",
    tags: ["deliverance", "faith", "miracle", "salvation"]
  },
  'sinai-covenant': {
    id: 'sinai-covenant',
    summary: "At Mount Sinai, God descends in fire, smoke, and thunder to give Israel the Ten Commandments. Moses mediates between the holy God and sinful people, receiving the Law that will shape a nation. The covenant establishes Israel as God's treasured possession.",
    keyVerse: {
      text: "Now if you obey me fully and keep my covenant, then out of all nations you will be my treasured possession.",
      reference: "Exodus 19:5"
    },
    whyItMatters: "Sinai reveals God's holiness and humanity's need for mediation—pointing to Christ as the perfect mediator of a better covenant.",
    tags: ["law", "covenant", "holiness", "mediation"]
  },
  'jericho': {
    id: 'jericho',
    summary: "For seven days, Israel marches silently around Jericho's massive walls. On the seventh day, seven priests blow trumpets and the people shout—then the walls collapse. Faith, not military might, conquers the fortified city.",
    keyVerse: {
      text: "By faith the walls of Jericho fell, after the army had marched around them for seven days.",
      reference: "Hebrews 11:30"
    },
    whyItMatters: "Jericho demonstrates that God's power works through obedient faith, not human strength or strategy.",
    tags: ["faith", "obedience", "victory", "conquest"]
  },
  'david-goliath': {
    id: 'david-goliath',
    summary: "A shepherd boy faces a nine-foot Philistine champion with a sling and five stones. David's confidence rests not in armor but in the living God. One stone finds its mark—Goliath falls, and Israel's future king emerges.",
    keyVerse: {
      text: "The Lord who rescued me from the paw of the lion and the paw of the bear will rescue me from the hand of this Philistine.",
      reference: "1 Samuel 17:37"
    },
    whyItMatters: "David's victory shows that God uses the unlikely and unqualified to accomplish His purposes through faith.",
    tags: ["faith", "courage", "underdog", "providence"]
  },
  'solomon-temple': {
    id: 'solomon-temple',
    summary: "Solomon builds a magnificent temple in Jerusalem—cedar from Lebanon, gold overlay, and the Ark placed in the Most Holy Place. At its dedication, God's glory fills the house in a cloud. Israel reaches its golden age zenith.",
    keyVerse: {
      text: "I have built a magnificent temple for you, a place for you to dwell forever.",
      reference: "1 Kings 8:13"
    },
    whyItMatters: "The temple foreshadows Christ as the true dwelling place of God among humanity, and the church as God's living temple.",
    tags: ["worship", "presence", "glory", "temple"]
  },
  'babylonian-exile': {
    id: 'babylonian-exile',
    summary: "Nebuchadnezzar's armies breach Jerusalem's walls, burn the temple, and carry Judah into exile. By Babylon's rivers, the people hang their harps and weep for Zion. Yet even in judgment, God preserves a remnant and promises restoration.",
    keyVerse: {
      text: "By the rivers of Babylon we sat and wept when we remembered Zion.",
      reference: "Psalm 137:1"
    },
    whyItMatters: "Exile reveals the seriousness of sin and God's faithfulness to discipline and restore His covenant people.",
    tags: ["judgment", "exile", "lament", "hope"]
  },
  'birth-of-jesus': {
    id: 'birth-of-jesus',
    summary: "In Bethlehem's humblest stable, Mary gives birth to the promised Messiah. Angels announce His arrival to shepherds; wise men follow a star bearing gifts. The Word becomes flesh and dwells among us.",
    keyVerse: {
      text: "Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.",
      reference: "Luke 2:11"
    },
    whyItMatters: "The incarnation—God becoming human—lies at the heart of Christianity, making salvation possible through Christ's identification with us.",
    tags: ["incarnation", "messiah", "hope", "fulfillment"]
  },
  'baptism-of-jesus': {
    id: 'baptism-of-jesus',
    summary: "Jesus enters the Jordan to be baptized by John. As He emerges, the heavens tear open—the Spirit descends like a dove, and the Father declares, 'This is my beloved Son.' The Trinity is revealed at the start of Jesus' public ministry.",
    keyVerse: {
      text: "This is my Son, whom I love; with him I am well pleased.",
      reference: "Matthew 3:17"
    },
    whyItMatters: "Jesus' baptism identifies Him with sinners He came to save and inaugurates His messianic mission.",
    tags: ["trinity", "identity", "mission", "anointing"]
  },
  'crucifixion': {
    id: 'crucifixion',
    summary: "At Golgotha, Jesus is nailed to a Roman cross between two criminals. Darkness covers the land from noon until three. With His final breath—'It is finished'—the temple veil tears from top to bottom, and the centurion confesses, 'Surely this was the Son of God.'",
    keyVerse: {
      text: "Father, into your hands I commit my spirit.",
      reference: "Luke 23:46"
    },
    whyItMatters: "The cross is the pivotal moment where God's justice and mercy meet—Christ bears sin's penalty to reconcile sinners to God.",
    tags: ["atonement", "sacrifice", "love", "victory"]
  },
  'resurrection': {
    id: 'resurrection',
    summary: "On the third day, women arrive at the tomb to find the stone rolled away and the body gone. Angels announce, 'He is not here; he has risen!' The resurrected Jesus appears to Mary, the disciples, and over 500 witnesses—death is defeated.",
    keyVerse: {
      text: "He is not here; he has risen, just as he said.",
      reference: "Matthew 28:6"
    },
    whyItMatters: "The resurrection validates Jesus' claims, defeats death, and guarantees believers' future resurrection and eternal life.",
    tags: ["victory", "hope", "new-creation", "witness"]
  },
  'pentecost': {
    id: 'pentecost',
    summary: "Fifty days after Passover, 120 disciples wait in Jerusalem as Jesus commanded. Suddenly a rushing wind fills the house, tongues of fire rest on each person, and they speak in other languages. Peter preaches; 3,000 are baptized—the church is born.",
    keyVerse: {
      text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses...",
      reference: "Acts 1:8"
    },
    whyItMatters: "Pentecost fulfills Joel's prophecy and empowers the church for its global mission through the indwelling Spirit.",
    tags: ["spirit", "church", "mission", "power"]
  },
  'pauls-conversion': {
    id: 'pauls-conversion',
    summary: "Breathing murderous threats, Saul travels to Damascus to arrest Christians. A blinding light from heaven strikes him down, and Jesus asks, 'Why do you persecute me?' Blinded for three days, Saul emerges as Paul—apostle to the Gentiles who will write half the New Testament.",
    keyVerse: {
      text: "This man is my chosen instrument to proclaim my name to the Gentiles and their kings and to the people of Israel.",
      reference: "Acts 9:15"
    },
    whyItMatters: "Paul's transformation demonstrates God's power to redeem even the worst persecutor and use him for kingdom purposes.",
    tags: ["transformation", "grace", "calling", "mission"]
  }
};

// Curated narrative summaries - concise 2-3 sentence stories that capture the emotional core
const CURATED_SUMMARIES: Record<string, string> = {
  "Red Sea": "God parts the Red Sea, allowing Israel to escape Egypt. Pharaoh's army is destroyed in the waters. A defining moment of divine deliverance that shapes Israel's identity.",
  "Moses at Mount Sinai": "God descends in fire and smoke to give the Ten Commandments. Moses receives the law that will define a nation. The covenant that shapes Western civilization is forged.",
  "David and Goliath": "A shepherd boy faces a giant with nothing but faith and a sling. David's stone finds its mark, toppling the Philistine champion. Courage triumphs over might.",
  "Solomon's Temple": "Israel's golden age reaches its peak with a temple for God. Solomon's wisdom builds a house of cedar and gold. The dwelling place of the Divine among men.",
  "Babylonian Exile": "Jerusalem falls. The temple burns. God's people are carried away to Babylon, their songs silenced by the rivers of a foreign land.",
  "Birth of Jesus": "In Bethlehem's humblest stable, the Word becomes flesh. Shepherds and wise men worship a child wrapped in swaddling clothes. Hope enters the world in silence.",
  "Baptism of Jesus": "The heavens tear open as Jesus emerges from the Jordan. The Spirit descends like a dove, and a voice declares divine sonship. The ministry begins.",
  "Crucifixion": "Darkness covers the land as the Son of God breathes his last. The temple veil tears. Love pours out blood and water from a pierced side.",
  "Resurrection": "The stone rolls away. Death is undone. Mary Magdalene meets the risen Christ in a garden, and everything changes forever.",
  "Pentecost": "Wind rushes through the upper room. Tongues of fire rest on each disciple. The Spirit empowers ordinary people to change the world.",
  "Paul's Conversion": "A zealous persecutor is blinded by light on the Damascus road. Saul the Pharisee becomes Paul the apostle. An enemy becomes God's chosen vessel.",
  "Creation": "Out of chaos, God speaks light into being. Heaven and earth take form. The first day dawns on a world waiting to be filled.",
  "Noah's Ark": "Forty days and nights of rain cover the earth. Only Noah's family and the animals survive. A rainbow promises never again.",
  "Abraham's Call": "Leave your home and go, God tells Abram. At 75, he steps into the unknown, trusting a promise of descendants as numerous as the stars.",
  "Jacob's Ladder": "Exiled and alone, Jacob dreams of angels ascending and descending. God renews the covenant in the wilderness. Bethel becomes the house of God.",
  "Joseph in Egypt": "Sold into slavery by his brothers, Joseph rises to save nations from famine. What was meant for evil, God uses for good. Forgiveness triumphs.",
  "Passover": "Blood on doorposts. Death passes over. Israel eats hurriedly, sandals on feet, staff in hand. Freedom comes at midnight.",
  "Walls of Jericho": "Seven days of marching. Seven priests with trumpets. On the seventh day, the walls come tumbling down. Faith makes the impossible possible.",
  "Daniel in Lions": "Faithful in exile, Daniel survives the lions' den. The king decrees that all must fear Daniel's God. Integrity outlasts empires.",
};

const INITIAL_VIEW = { longitude: 35.2, latitude: 31.8, zoom: 4.5, pitch: 35, bearing: 0 };

interface BibleEvent {
  name: string; ussher_year: number; epoch_id: number; event_type: string;
  description: string; lon: number; lat: number; verse_text_snippet: string;
  primary_book: string; verse_reference: string;
}

// Journey mode definitions with curated waypoints
const JOURNEY_DEFINITIONS: Record<string, { name: string; waypoints: Array<{ name: string; lat: number; lon: number; year: number; description: string }> }> = {
  exodus: {
    name: "The Exodus Journey",
    waypoints: [
      { name: "Israel in Egypt", lat: 30.0444, lon: 31.2357, year: -1446, description: "400 years of slavery in Egypt" },
      { name: "Red Sea Crossing", lat: 29.5, lon: 32.8, year: -1446, description: "God parts the waters" },
      { name: "Mount Sinai", lat: 28.5, lon: 33.9, year: -1446, description: "The Law is given" },
      { name: "Kadesh Barnea", lat: 30.7, lon: 34.5, year: -1445, description: "40 years of wandering begin" },
      { name: "Plains of Moab", lat: 31.7, lon: 35.7, year: -1406, description: "Moses' final address" },
    ]
  },
  paul1: {
    name: "Paul's First Missionary Journey",
    waypoints: [
      { name: "Antioch", lat: 36.2, lon: 36.1, year: 46, description: "Sent out by the Spirit" },
      { name: "Cyprus", lat: 35.0, lon: 33.0, year: 46, description: "Proconsul believes" },
      { name: "Pisidian Antioch", lat: 38.3, lon: 31.2, year: 47, description: "Gentiles rejoice at the Word" },
      { name: "Iconium", lat: 37.9, lon: 32.5, year: 47, description: "Signs and wonders" },
      { name: "Lystra & Derbe", lat: 37.5, lon: 33.0, year: 47, description: "Stoned and left for dead" },
    ]
  },
  jesus_ministry: {
    name: "Jesus' Galilean Ministry",
    waypoints: [
      { name: "Nazareth", lat: 32.7, lon: 35.3, year: 27, description: "No prophet is accepted in hometown" },
      { name: "Capernaum", lat: 32.9, lon: 35.6, year: 27, description: "His ministry headquarters" },
      { name: "Sea of Galilee", lat: 32.8, lon: 35.6, year: 28, description: "Calming storms, walking on water" },
      { name: "Caesarea Philippi", lat: 33.2, lon: 35.7, year: 29, description: "You are the Christ" },
      { name: "Mount of Transfiguration", lat: 32.7, lon: 35.4, year: 29, description: "Glory revealed" },
    ]
  }
};

// Calculate related events using Arrow table (no new data fetch)
function calculateRelatedEvents(
  table: Table,
  selectedEvent: BibleEvent,
  selectedIdx: number
): { before: BibleEvent[], after: BibleEvent[], nearby: BibleEvent[] } {
  const before: BibleEvent[] = [];
  const after: BibleEvent[] = [];
  const nearby: BibleEvent[] = [];
  
  const cols = {
    n: table.getChild("name"),
    y: table.getChild("ussher_year"),
    e: table.getChild("epoch_id"),
    t: table.getChild("event_type"),
    d: table.getChild("description"),
    lo: table.getChild("lon"),
    la: table.getChild("lat"),
    v: table.getChild("verse_text_snippet"),
    pb: table.getChild("primary_book"),
    vr: table.getChild("verse_reference"),
  };

  // Get all events with their indices, sorted by year
  const eventsWithIdx: Array<{idx: number, year: number}> = [];
  for (let i = 0; i < table.numRows; i++) {
    eventsWithIdx.push({ idx: i, year: Number(cols.y?.get(i) ?? 0) });
  }
  eventsWithIdx.sort((a, b) => a.year - b.year);
  
  const selectedPos = eventsWithIdx.findIndex(e => e.idx === selectedIdx);
  
  // Get 3 before and 3 after
  for (let i = Math.max(0, selectedPos - 3); i < selectedPos; i++) {
    const idx = eventsWithIdx[i].idx;
    before.push({
      name: String(cols.n?.get(idx) ?? ""),
      ussher_year: Number(cols.y?.get(idx) ?? 0),
      epoch_id: Number(cols.e?.get(idx) ?? 0),
      event_type: String(cols.t?.get(idx) ?? ""),
      description: String(cols.d?.get(idx) ?? ""),
      lon: Number(cols.lo?.get(idx) ?? 0),
      lat: Number(cols.la?.get(idx) ?? 0),
      verse_text_snippet: String(cols.v?.get(idx) ?? ""),
      primary_book: String(cols.pb?.get(idx) ?? ""),
      verse_reference: String(cols.vr?.get(idx) ?? ""),
    });
  }
  
  for (let i = selectedPos + 1; i <= Math.min(eventsWithIdx.length - 1, selectedPos + 3); i++) {
    const idx = eventsWithIdx[i].idx;
    after.push({
      name: String(cols.n?.get(idx) ?? ""),
      ussher_year: Number(cols.y?.get(idx) ?? 0),
      epoch_id: Number(cols.e?.get(idx) ?? 0),
      event_type: String(cols.t?.get(idx) ?? ""),
      description: String(cols.d?.get(idx) ?? ""),
      lon: Number(cols.lo?.get(idx) ?? 0),
      lat: Number(cols.la?.get(idx) ?? 0),
      verse_text_snippet: String(cols.v?.get(idx) ?? ""),
      primary_book: String(cols.pb?.get(idx) ?? ""),
      verse_reference: String(cols.vr?.get(idx) ?? ""),
    });
  }

  // Find nearby events (within 50km and ±100 years)
  const selectedLat = selectedEvent.lat;
  const selectedLon = selectedEvent.lon;
  const selectedYear = selectedEvent.ussher_year;
  
  for (let i = 0; i < table.numRows && nearby.length < 5; i++) {
    if (i === selectedIdx) continue;
    
    const lat = Number(cols.la?.get(i) ?? 0);
    const lon = Number(cols.lo?.get(i) ?? 0);
    const year = Number(cols.y?.get(i) ?? 0);
    
    // Simple distance check (approx 50km ~ 0.45 degrees)
    const latDiff = Math.abs(lat - selectedLat);
    const lonDiff = Math.abs(lon - selectedLon);
    const yearDiff = Math.abs(year - selectedYear);
    
    if (latDiff < 0.45 && lonDiff < 0.45 && yearDiff <= 100) {
      nearby.push({
        name: String(cols.n?.get(i) ?? ""),
        ussher_year: year,
        epoch_id: Number(cols.e?.get(i) ?? 0),
        event_type: String(cols.t?.get(i) ?? ""),
        description: String(cols.d?.get(i) ?? ""),
        lon, lat,
        verse_text_snippet: String(cols.v?.get(i) ?? ""),
        primary_book: String(cols.pb?.get(i) ?? ""),
        verse_reference: String(cols.vr?.get(i) ?? ""),
      });
    }
  }

  return { before: before.reverse(), after, nearby };
}

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── Parquet loader ────────────────────────────────────────────────────────────
async function fetchAndUnpackEvents(url: string, onProgress?: (loaded: number, total: number) => void): Promise<Table> {
  const parquet = await import("parquet-wasm/esm");
  await (parquet as any).default?.();
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  
  // Track download progress
  const contentLength = resp.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const reader = resp.body?.getReader();
  const chunks = [];
  let loaded = 0;
  
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onProgress && total) {
        onProgress(loaded, total);
      }
    }
  }
  
  const buffer = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  
  const wasmTbl = (parquet as any).readParquet(buffer);
  const table = tableFromIPC(wasmTbl.intoIPCStream());

  // ZERO-COPY: Return Arrow Table directly - no JS object allocation
  return table;
}

async function fetchAndUnpackJourneys(url: string): Promise<any[]> {
  const parquet = await import("parquet-wasm/esm");
  await (parquet as any).default?.();
  const resp = await fetch(url);
  if (!resp.ok) return [];
  const buffer = await resp.arrayBuffer();
  const wasmTbl = (parquet as any).readParquet(new Uint8Array(buffer));
  const table = tableFromIPC(wasmTbl.intoIPCStream());

  const journeys = [];
  for (let i = 0; i < table.numRows; i++) {
    // THE FIX: Deep-unpack the Arrow Vectors into standard JS Arrays
    const rawPath = table.getChild("path")?.get(i)?.toJSON() ?? [];
    const formattedPath = rawPath.map((pt: any) => Array.isArray(pt) ? pt : Array.from(pt));
    
    const rawTimes = table.getChild("timestamps")?.get(i)?.toJSON() ?? [];
    const formattedTimes = Array.isArray(rawTimes) ? rawTimes : Array.from(rawTimes);

    const colorData = table.getChild("color")?.get(i);
    journeys.push({
      name: String(table.getChild("name")?.get(i) ?? ""),
      epoch_id: Number(table.getChild("epoch_id")?.get(i) ?? 0),
      primary_book: String(table.getChild("primary_book")?.get(i) ?? ""),
      path: formattedPath,
      timestamps: formattedTimes,
      color: colorData ? Array.from(colorData).map(Number) : [253, 128, 93],
    });
  }
  return journeys;
}
// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ info }: { info: PickingInfo | null }) {
  if (!info?.object) return null;
  const data = info.object as BibleEvent;

  const yearLabel = data.ussher_year < 0
    ? `${Math.abs(Math.round(data.ussher_year))} BC`
    : `${Math.round(data.ussher_year)} AD`;

  return (
    <div style={{ position: "fixed", pointerEvents: "none", background: "rgba(0,43,54,0.93)", color: "#839496", border: "1px solid #073642", borderRadius: 8, padding: "10px 14px", fontSize: 13, lineHeight: 1.5, zIndex: 1000, maxWidth: 300 }}>
      <strong style={{ color: "#eee8d5" }}>{data.name}</strong>
      <div style={{ color: "#586e75", fontSize: 11, marginBottom: 4 }}>
        {yearLabel} · {data.event_type}
      </div>
      <div>{data.description}</div>
      {data.verse_text_snippet && (
        <div style={{ marginTop: 8, fontStyle: "italic", color: "#93a1a1", borderTop: "1px solid #073642", paddingTop: 8 }}>
          &ldquo;{data.verse_text_snippet}&hellip;&rdquo;
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DataLoader({ initialParams }: { initialParams?: { [key: string]: string | string[] | undefined } }) {
  const [arrowTable,    setArrowTable]    = useState<Table | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [loadProgress,  setLoadProgress]  = useState({ stage: "Initializing...", percent: 0, loaded: 0, total: 0 });
  const [activeEpochId, setActiveEpochId] = useState(0);
  const [currentYear,   setCurrentYear]   = useState(0);
  const [hoverInfo,     setHoverInfo]     = useState<PickingInfo | null>(null);
  const [selectedBook,  setSelectedBook]  = useState<string>("All");
  const [journeys,      setJourneys]      = useState<any[]>([]);
  const [journeyQuery,  setJourneyQuery]  = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<BibleEvent | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState<{ before: BibleEvent[], after: BibleEvent[], nearby: BibleEvent[] }>({ before: [], after: [], nearby: [] });
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [highlightedEventIndex, setHighlightedEventIndex] = useState(-1);
  const [filmGrainEnabled, setFilmGrainEnabled] = useState(false);
  const [parchmentMode, setParchmentMode] = useState(false);
  const [showJourneyPaths, setShowJourneyPaths] = useState(true);
  const [loadedChunks, setLoadedChunks] = useState<Map<number, Table>>(() => new Map());
  const [loadingChunks, setLoadingChunks] = useState<Set<number>>(() => new Set());
  const [chunkErrors, setChunkErrors] = useState<Map<number, string>>(() => new Map());
  const [retryCount, setRetryCount] = useState<Map<number, number>>(() => new Map());
  // Engagement features
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null);
  const [journeyMode, setJourneyMode] = useState<string | null>(null);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const isPlaying  = useRef(false);
  const lastTsRef  = useRef<number | null>(null);
  const rafRef     = useRef<number | null>(null);
  const mapRef     = useRef<any>(null);
  const maxYearRef = useRef<number>(0);
  const randomQuote = useRef(BIBLICAL_QUOTES[Math.floor(Math.random() * BIBLICAL_QUOTES.length)]);

  // Canonical book order: only books present in data
  const uniqueBooks = useMemo(() => {
    if (!arrowTable) return ["All"];
    const bookCol = arrowTable.getChild("primary_book");
    const inData = new Set<string>();
    for (let i = 0; i < arrowTable.numRows; i++) {
      const book = bookCol?.get(i);
      if (book) inData.add(String(book));
    }
    return ["All", ...CANONICAL_BOOK_ORDER.filter((b) => inData.has(b))];
  }, [arrowTable]);

  const filteredIndices = useMemo(() => {
    if (!arrowTable) return [];
    
    const indices: number[] = [];
    const bookCol = arrowTable.getChild("primary_book");
    const nameCol = arrowTable.getChild("name");
    const descCol = arrowTable.getChild("description");
    const verseCol = arrowTable.getChild("verse_text_snippet");
    
    for (let i = 0; i < arrowTable.numRows; i++) {
      // Book filter
      if (selectedBook !== "All") {
        const book = String(bookCol?.get(i) ?? "");
        if (book !== selectedBook) continue;
      }
      
      // Text search filter (min 2 chars)
      if (eventSearchQuery && eventSearchQuery.length >= 2) {
        const q = eventSearchQuery.toLowerCase();
        const name = String(nameCol?.get(i) ?? "").toLowerCase();
        const desc = String(descCol?.get(i) ?? "").toLowerCase();
        const verse = String(verseCol?.get(i) ?? "").toLowerCase();
        
        if (!name.includes(q) && !desc.includes(q) && !verse.includes(q)) {
          continue;
        }
      }
      
      indices.push(i);
    }
    
    return indices;
  }, [arrowTable, selectedBook, eventSearchQuery]);

  const { minYear, maxYear } = useMemo(() => {
    if (!arrowTable || filteredIndices.length === 0) return { minYear: 0, maxYear: 0 };
    
    const yearCol = arrowTable.getChild("ussher_year");
    const epochCol = arrowTable.getChild("epoch_id");
    
    let min = Infinity;
    let max = -Infinity;
    
    for (const idx of filteredIndices) {
      const epochId = Number(epochCol?.get(idx) ?? 0);
      if (epochId !== activeEpochId) continue;
      
      const year = Number(yearCol?.get(idx) ?? 0);
      if (year < min) min = year;
      if (year > max) max = year;
    }
    
    return { minYear: min === Infinity ? 0 : min, maxYear: max === -Infinity ? 0 : max };
  }, [arrowTable, filteredIndices, activeEpochId]);

  useEffect(() => { maxYearRef.current = maxYear; }, [maxYear]);

  useEffect(() => {
    if (arrowTable && currentYear === 0) setCurrentYear(minYear);
  }, [arrowTable, minYear, currentYear]);

  // LRU eviction to prevent memory leaks
  const MAX_CHUNKS_IN_MEMORY = 3; // Current + 1 before + 1 after
  
  const evictOldChunks = useCallback((newEpochId: number) => {
    setLoadedChunks(prev => {
      const next = new Map(prev);
      
      // Keep only chunks within 1 of current epoch
      for (const [epochId] of next) {
        if (Math.abs(epochId - newEpochId) > 1) {
          next.delete(epochId);
        }
      }
      
      // If still over limit, remove oldest
      if (next.size > MAX_CHUNKS_IN_MEMORY) {
        const toDelete = Array.from(next.keys())
          .sort((a, b) => Math.abs(a - newEpochId) - Math.abs(b - newEpochId))
          .slice(MAX_CHUNKS_IN_MEMORY);
        toDelete.forEach(id => next.delete(id));
      }
      
      return next;
    });
  }, []);

  // Load chunk on demand
  const loadChunk = useCallback(async (epochId: number, retry = 0) => {
    if (loadedChunks.has(epochId) || loadingChunks.has(epochId)) return;
    
    setLoadingChunks(prev => new Set(prev).add(epochId));
    // Clear previous error for this chunk
    setChunkErrors(prev => {
      const next = new Map(prev);
      next.delete(epochId);
      return next;
    });
    
    try {
      const epochNames = ['creation', 'patriarchs', 'exodus', 'kings', 'exile', 'intertestamental', 'gospels'];
      const url = `/data/epoch-${epochId}-${epochNames[epochId]}.parquet`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const parquet = await import("parquet-wasm/esm");
      await (parquet as any).default?.();
      const wasmTable = (parquet as any).readParquet(new Uint8Array(buffer));
      const table = tableFromIPC(wasmTable.intoIPCStream());
      
      setLoadedChunks(prev => {
        const next = new Map(prev);
        next.set(epochId, table);
        return next;
      });
      // Clear retry count on success
      setRetryCount(prev => {
        const next = new Map(prev);
        next.delete(epochId);
        return next;
      });
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load';
      console.warn(`Failed to load chunk ${epochId}:`, err);
      setChunkErrors(prev => new Map(prev).set(epochId, errorMsg));
      
      // Retry logic (max 3 attempts with exponential backoff)
      if (retry < 3) {
        const delay = Math.pow(2, retry) * 1000;
        setTimeout(() => loadChunk(epochId, retry + 1), delay);
        setRetryCount(prev => new Map(prev).set(epochId, retry + 1));
      }
    } finally {
      setLoadingChunks(prev => {
        const next = new Set(prev);
        next.delete(epochId);
        return next;
      });
    }
  }, [loadedChunks, loadingChunks]);

  // Load current epoch + preload adjacent
  useEffect(() => {
    loadChunk(activeEpochId);
    // Preload neighbors
    if (activeEpochId > 0) loadChunk(activeEpochId - 1);
    if (activeEpochId < 5) loadChunk(activeEpochId + 1);
  }, [activeEpochId, loadChunk]);

  // Evict old chunks on epoch change
  useEffect(() => {
    evictOldChunks(activeEpochId);
  }, [activeEpochId, evictOldChunks]);

  // Merge loaded chunks for rendering
  const activeTable = useMemo(() => {
    const tables = Array.from(loadedChunks.values());
    if (tables.length === 0) return null;
    if (tables.length === 1) return tables[0];
    return tables[0].concat(...tables.slice(1));
  }, [loadedChunks]);

  // Sync activeTable to arrowTable for backward compatibility
  useEffect(() => {
    if (activeTable) {
      setArrowTable(activeTable);
      setLoading(false);
    }
  }, [activeTable]);

  // Data fetch + mount-time URL sync
  useEffect(() => {
    fetchAndUnpackJourneys("/bible-journeys.parquet?v=" + Date.now()).then(setJourneys);
    
    // Load initial chunk instead of full file
    setLoadProgress({ stage: "Loading Creation era...", percent: 0, loaded: 0, total: 0 });
    loadChunk(0);

    const hash = window.location.hash;
    const epochFound = EPOCHS.find((ep) => hash.startsWith(ep.hash));
    if (epochFound) setActiveEpochId(epochFound.id);

    const bookParam = hash.split("&").find((p) => p.startsWith("book="));
    if (bookParam) {
      const bookVal = decodeURIComponent(bookParam.slice(5));
      if (bookVal === "All" || true) {
        setSelectedBook(bookVal);
      }
    }
  }, []);

  // Parse initial URL params and restore state
  useEffect(() => {
    if (!initialParams || !arrowTable) return;
    
    const eventParam = initialParams.event as string;
    const latParam = initialParams.lat as string;
    const lngParam = initialParams.lng as string;
    const zoomParam = initialParams.zoom as string;
    
    if (eventParam && arrowTable) {
      // Find event by name or index
      const nameCol = arrowTable.getChild("name");
      for (let i = 0; i < arrowTable.numRows; i++) {
        const name = String(nameCol?.get(i) ?? "");
        if (name.toLowerCase().replace(/\s+/g, '-') === eventParam || 
            name.toLowerCase() === eventParam.toLowerCase() ||
            i.toString() === eventParam) {
          // Found the event, simulate click
          const cols = {
            n: arrowTable.getChild("name"),
            y: arrowTable.getChild("ussher_year"),
            e: arrowTable.getChild("epoch_id"),
            t: arrowTable.getChild("event_type"),
            d: arrowTable.getChild("description"),
            lo: arrowTable.getChild("lon"),
            la: arrowTable.getChild("lat"),
            v: arrowTable.getChild("verse_text_snippet"),
            pb: arrowTable.getChild("primary_book"),
            vr: arrowTable.getChild("verse_reference"),
          };
          const eventData: BibleEvent = {
            name: String(cols.n?.get(i) ?? ""),
            ussher_year: Number(cols.y?.get(i) ?? 0),
            epoch_id: Number(cols.e?.get(i) ?? 0),
            event_type: String(cols.t?.get(i) ?? ""),
            description: String(cols.d?.get(i) ?? ""),
            lon: Number(cols.lo?.get(i) ?? 0),
            lat: Number(cols.la?.get(i) ?? 0),
            verse_text_snippet: String(cols.v?.get(i) ?? ""),
            primary_book: String(cols.pb?.get(i) ?? ""),
            verse_reference: String(cols.vr?.get(i) ?? ""),
          };
          setSelectedEvent(eventData);
          setActiveEpochId(eventData.epoch_id);
          setCurrentYear(eventData.ussher_year);
          break;
        }
      }
    }
    
    if (latParam && lngParam && zoomParam && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: [parseFloat(lngParam), parseFloat(latParam)],
          zoom: parseFloat(zoomParam),
          duration: 1000
        });
      }, 1000);
    }
  }, [initialParams, arrowTable]);

  const stopAnim = useCallback(() => {
    isPlaying.current = false;
    lastTsRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const startAnim = useCallback(() => {
    if (isPlaying.current) return;
    isPlaying.current = true;
    const tick = (ts: number) => {
      if (!isPlaying.current) return;
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
      lastTsRef.current = ts;
      setCurrentYear((prev) => {
        const next = prev + SPEED * dt;
        if (next >= maxYearRef.current) { stopAnim(); return maxYearRef.current; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopAnim]);

  // Audio narration functions
  const playNarration = useCallback((eventId: string, eventName: string) => {
    // Stop any existing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    // Try to load pre-generated audio (from storyteller project or public/audio)
    const sanitizedId = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const audioUrl = `/audio/${sanitizedId}.mp3`;
    
    const audio = new Audio(audioUrl);
    audio.volume = audioVolume;
    audio.preload = 'metadata';
    
    audio.oncanplaythrough = () => {
      audio.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        // Fallback: use Web Speech API for TTS if audio file not found
        if ('speechSynthesis' in window && selectedEvent?.verse_text_snippet) {
          const utterance = new SpeechSynthesisUtterance(
            selectedEvent.verse_text_snippet.slice(0, 200)
          );
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = audioVolume;
          utterance.onend = () => setIsPlayingAudio(false);
          speechSynthesis.speak(utterance);
          setIsPlayingAudio(true);
        } else {
          setIsPlayingAudio(false);
        }
      });
    };

    audio.onerror = () => {
      // Try Web Speech API fallback
      if ('speechSynthesis' in window && selectedEvent?.verse_text_snippet) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          selectedEvent.name + ". " + selectedEvent.verse_text_snippet.slice(0, 150)
        );
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    };

    audio.onended = () => {
      setIsPlayingAudio(false);
      setAudioElement(null);
    };

    setAudioElement(audio);
  }, [audioElement, audioVolume, selectedEvent]);

  const stopNarration = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  }, [audioElement]);

  // Ambient soundscape management
  useEffect(() => {
    if (ambientEnabled && !ambientAudio) {
      // Create ambient audio element (user must interact first due to autoplay policies)
      const ambient = new Audio();
      ambient.loop = true;
      ambient.volume = 0.15;
      // Could load different ambient tracks based on region/epoch
      // For now, we'll set it up but not auto-play (requires user interaction)
      setAmbientAudio(ambient);
    } else if (!ambientEnabled && ambientAudio) {
      ambientAudio.pause();
    }
  }, [ambientEnabled, ambientAudio]);

  // Journey mode animation
  useEffect(() => {
    if (!journeyMode || !JOURNEY_DEFINITIONS[journeyMode]) return;

    const journey = JOURNEY_DEFINITIONS[journeyMode];
    const waypoints = journey.waypoints;
    let currentIndex = 0;
    let progressInterval: NodeJS.Timeout;

    const advanceWaypoint = () => {
      if (currentIndex >= waypoints.length) {
        currentIndex = 0; // Loop back to start
      }

      const waypoint = waypoints[currentIndex];
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [waypoint.lon, waypoint.lat],
          zoom: 7,
          duration: 2000,
          essential: true
        });
      }

      // Update progress
      setJourneyProgress((currentIndex + 1) / waypoints.length);
      
      // Try to find and select the event at this waypoint
      if (arrowTable) {
        const nameCol = arrowTable.getChild("name");
        for (let i = 0; i < Math.min(100, arrowTable.numRows); i++) {
          const name = String(nameCol?.get(i) ?? "");
          if (name.toLowerCase().includes(waypoint.name.toLowerCase().split(' ')[0])) {
            // Found a matching event - could auto-select it
            break;
          }
        }
      }

      currentIndex++;
    };

    // Start immediately, then every 4 seconds
    advanceWaypoint();
    progressInterval = setInterval(advanceWaypoint, 4000);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [journeyMode, arrowTable]);

  // Track mouse for reactive particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          stopAnim();
          setCurrentYear(prev => Math.max(minYear, prev - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          stopAnim();
          setCurrentYear(prev => Math.min(maxYear, prev + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredIndices.length > 0) {
            const nextIdx = (highlightedEventIndex + 1) % filteredIndices.length;
            setHighlightedEventIndex(nextIdx);
            // Could fly to event here
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (filteredIndices.length > 0) {
            const nextIdx = highlightedEventIndex <= 0 
              ? filteredIndices.length - 1 
              : highlightedEventIndex - 1;
            setHighlightedEventIndex(nextIdx);
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedEventIndex >= 0 && highlightedEventIndex < filteredIndices.length && arrowTable) {
            const idx = filteredIndices[highlightedEventIndex];
            // Trigger click on highlighted event
            const cols = {
              n: arrowTable.getChild("name"),
              y: arrowTable.getChild("ussher_year"),
              e: arrowTable.getChild("epoch_id"),
              t: arrowTable.getChild("event_type"),
              d: arrowTable.getChild("description"),
              lo: arrowTable.getChild("lon"),
              la: arrowTable.getChild("lat"),
              v: arrowTable.getChild("verse_text_snippet"),
              pb: arrowTable.getChild("primary_book"),
              vr: arrowTable.getChild("verse_reference"),
            };
            const eventData: BibleEvent = {
              name: String(cols.n?.get(idx) ?? ""),
              ussher_year: Number(cols.y?.get(idx) ?? 0),
              epoch_id: Number(cols.e?.get(idx) ?? 0),
              event_type: String(cols.t?.get(idx) ?? ""),
              description: String(cols.d?.get(idx) ?? ""),
              lon: Number(cols.lo?.get(idx) ?? 0),
              lat: Number(cols.la?.get(idx) ?? 0),
              verse_text_snippet: String(cols.v?.get(idx) ?? ""),
              primary_book: String(cols.pb?.get(idx) ?? ""),
              verse_reference: String(cols.vr?.get(idx) ?? ""),
            };
            setSelectedEvent(eventData);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedEvent(null);
          setShowVerseModal(false);
          setIsSidebarOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minYear, maxYear, filteredIndices, highlightedEventIndex, arrowTable, stopAnim]);

  // Update URL when event is selected
  useEffect(() => {
    if (!selectedEvent || !mapRef.current) return;
    
    const eventSlug = selectedEvent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const view = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom();
    
    const params = new URLSearchParams();
    params.set('event', eventSlug);
    params.set('lat', view.lat.toFixed(4));
    params.set('lng', view.lng.toFixed(4));
    params.set('zoom', zoom.toFixed(2));
    
    const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
  }, [selectedEvent]);

  // Calculate related events when selection changes
  useEffect(() => {
    if (!selectedEvent || !arrowTable) {
      setRelatedEvents({ before: [], after: [], nearby: [] });
      return;
    }
    
    // Find selected event index
    const nameCol = arrowTable.getChild("name");
    let selectedIdx = -1;
    for (let i = 0; i < arrowTable.numRows; i++) {
      if (String(nameCol?.get(i) ?? "") === selectedEvent.name) {
        selectedIdx = i;
        break;
      }
    }
    
    if (selectedIdx >= 0) {
      const related = calculateRelatedEvents(arrowTable, selectedEvent, selectedIdx);
      setRelatedEvents(related);
    }
  }, [selectedEvent, arrowTable]);

  // Prevent body scroll when modals/panels are open
  useEffect(() => {
    if (selectedEvent || showVerseModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [selectedEvent, showVerseModal]);

  const handleBookChange = useCallback((book: string) => {
    setSelectedBook(book);
    const baseHash = window.location.hash.split("&")[0];
    window.history.replaceState(null, "", `${baseHash}&book=${book}`);
  }, []);

  const activeJourneys = useMemo(() => {
  // THE FIX: Show all journeys by default, only filter if the user types something
  if (!journeyQuery.trim()) return [];
  
  const q = journeyQuery.toLowerCase();
  return journeys.filter((j) => 
    j.name.toLowerCase().includes(q) || j.primary_book.toLowerCase().includes(q)
  );
}, [journeys, journeyQuery]);

  // Cinematic lighting effect - simplified for compatibility
  const lightingEffect = useMemo(() => {
    // @ts-ignore - Using any to bypass type issues with newer deck.gl
    return new LightingEffect({
      ambientLight: new AmbientLight({
        color: [255, 255, 255],
        intensity: 0.4
      }),
      directionalLight1: new DirectionalLight({
        color: [255, 240, 220],
        intensity: 1.2,
        direction: [-1, -2, -3]
      }),
      directionalLight2: new DirectionalLight({
        color: [200, 220, 255],
        intensity: 0.3,
        direction: [1, 1, -2]
      })
    } as any);
  }, []);

  const layers = [
    // Glowing journey paths with animated trails
    ...(showJourneyPaths ? [
      new PathLayer({
        id: "journey-path-glow",
        data: activeJourneys,
        getPath: (d) => d.path,
        getColor: (d) => d.color ? [...d.color.slice(0, 3), 40] : [253, 128, 93, 40],
        getWidth: 12,
        widthMinPixels: 8,
        widthMaxPixels: 20,
        extensions: [new DataFilterExtension({ filterSize: 2 })],
        getFilterValue: (d) => [d.epoch_id, d.epoch_id],
        filterRange: [[activeEpochId, activeEpochId], [activeEpochId, activeEpochId]],
        updateTriggers: { getFilterValue: [activeEpochId] }
      } as any),
      new PathLayer({
        id: "journey-path",
        data: activeJourneys,
        getPath: (d) => d.path,
        getColor: (d) => d.color ? [...d.color, 200] : [253, 200, 100, 200],
        getWidth: 3,
        widthMinPixels: 3,
        widthMaxPixels: 6,
        extensions: [new DataFilterExtension({ filterSize: 2 })],
        getFilterValue: (d) => [d.epoch_id, d.epoch_id],
        filterRange: [[activeEpochId, activeEpochId], [activeEpochId, activeEpochId]],
        updateTriggers: { getFilterValue: [activeEpochId] }
      } as any),
      new TripsLayer({
        id: "journey-animation",
        data: activeJourneys,
        getPath: (d) => d.path,
        getTimestamps: (d) => d.timestamps,
        getColor: (d) => d.color ? [...d.color, 255] : [255, 220, 120, 255],
        opacity: 0.9,
        widthMinPixels: 6,
        trailLength: 500,
        currentTime: currentYear,
        extensions: [new DataFilterExtension({ filterSize: 2 })],
        getFilterValue: (d) => [d.epoch_id, d.epoch_id],
        filterRange: [[activeEpochId, activeEpochId], [activeEpochId, activeEpochId]],
        updateTriggers: { getFilterValue: [activeEpochId] }
      } as any),
    ] : []),
    // Journey Mode animated waypoint marker
    ...(journeyMode && JOURNEY_DEFINITIONS[journeyMode] ? [
      new ScatterplotLayer({
        id: "journey-mode-marker",
        data: [JOURNEY_DEFINITIONS[journeyMode].waypoints[Math.floor(journeyProgress * JOURNEY_DEFINITIONS[journeyMode].waypoints.length)] || JOURNEY_DEFINITIONS[journeyMode].waypoints[0]].filter(Boolean),
        getPosition: (d: any) => [d.lon, d.lat],
        getFillColor: [255, 180, 50, 220],
        getLineColor: [255, 220, 150, 255],
        getRadius: 18 + Math.sin(Date.now() / 300) * 4,
        radiusUnits: "pixels",
        stroked: true,
        filled: true,
        lineWidthMinPixels: 3,
        pickable: false,
      } as any),
      new ScatterplotLayer({
        id: "journey-mode-pulse",
        data: [JOURNEY_DEFINITIONS[journeyMode].waypoints[Math.floor(journeyProgress * JOURNEY_DEFINITIONS[journeyMode].waypoints.length)] || JOURNEY_DEFINITIONS[journeyMode].waypoints[0]].filter(Boolean),
        getPosition: (d: any) => [d.lon, d.lat],
        getFillColor: [255, 160, 0, 40],
        getRadius: 45 + Math.sin(Date.now() / 500) * 10,
        radiusUnits: "pixels",
        stroked: false,
        filled: true,
        pickable: false,
      } as any),
    ] : []),
    // Particle effects layer for major events (Exodus, Crucifixion, etc.)
    new ScatterplotLayer({
      id: "major-events-glow",
      data: filteredIndices.filter(idx => {
        if (!arrowTable) return false;
        const typeCol = arrowTable.getChild("event_type");
        const nameCol = arrowTable.getChild("name");
        const type = String(typeCol?.get(idx) ?? "");
        const name = String(nameCol?.get(idx) ?? "").toLowerCase();
        return type === "miracle" || type === "covenant" || 
               name.includes("exodus") || name.includes("crucifixion") || 
               name.includes("resurrection") || name.includes("creation");
      }),
      getPosition: (idx: number) => {
        if (!arrowTable) return [0, 0];
        const lonCol = arrowTable.getChild("lon");
        const latCol = arrowTable.getChild("lat");
        return [Number(lonCol?.get(idx) ?? 0), Number(latCol?.get(idx) ?? 0)];
      },
      getFillColor: [255, 200, 100, 25],
      getRadius: (idx: number) => {
        // Pulsing effect with mouse proximity boost
        const baseRadius = 40;
        const pulse = Math.sin(Date.now() / 800 + idx * 0.1) * 8;
        // Add subtle mouse reactivity (if we had screen coords, we'd calculate distance)
        // For now, just use a time-based variation that feels alive
        const mouseInfluence = Math.sin(Date.now() / 2000) * 5;
        return baseRadius + pulse + mouseInfluence;
      },
      radiusUnits: "pixels",
      stroked: false,
      filled: true,
      extensions: [new DataFilterExtension({ filterSize: 2 })],
      getFilterValue: (idx: number) => {
        if (!arrowTable) return [0, 0];
        const yearCol = arrowTable.getChild("ussher_year");
        const epochCol = arrowTable.getChild("epoch_id");
        return [Number(yearCol?.get(idx) ?? 0), Number(epochCol?.get(idx) ?? 0)];
      },
      filterRange: [[minYear - 1, currentYear], [activeEpochId, activeEpochId]],
      updateTriggers: { 
        getFilterValue: [currentYear, activeEpochId],
        getRadius: [mousePosition.x, mousePosition.y] // Re-render on mouse move
      },
    } as any),
    new ScatterplotLayer({
      id: "bible-points",
      data: filteredIndices,
      // ZERO-COPY: Access Arrow vectors directly, no JS object creation
      getPosition: (idx: number) => {
        if (!arrowTable) return [0, 0];
        const lonCol = arrowTable.getChild("lon");
        const latCol = arrowTable.getChild("lat");
        return [
          Number(lonCol?.get(idx) ?? 0),
          Number(latCol?.get(idx) ?? 0)
        ];
      },
      getFillColor: (idx: number) => {
        if (!arrowTable) return DEFAULT_COLOR;
        const typeCol = arrowTable.getChild("event_type");
        const type = String(typeCol?.get(idx) ?? "general");
        return TYPE_COLORS[type] ?? DEFAULT_COLOR;
      },
      getRadius: (idx: number) => {
        if (!arrowTable) return 5;
        const typeCol = arrowTable.getChild("event_type");
        const type = String(typeCol?.get(idx) ?? "");
        return type === "battle" ? 10 : 5;
      },
      radiusUnits:     "pixels",
      radiusMinPixels: 4,
      radiusMaxPixels: 12,
      pickable:        true,
      onHover: (info: PickingInfo) => {
        if (info.object !== undefined && info.index >= 0 && arrowTable) {
          const idx = info.object as number;
          // Create BibleEvent on-demand for tooltip (only when hovered)
          const cols = {
            n: arrowTable.getChild("name"),
            y: arrowTable.getChild("ussher_year"),
            t: arrowTable.getChild("event_type"),
            d: arrowTable.getChild("description"),
            v: arrowTable.getChild("verse_text_snippet"),
          };
          const eventData: BibleEvent = {
            name: String(cols.n?.get(idx) ?? ""),
            ussher_year: Number(cols.y?.get(idx) ?? 0),
            epoch_id: 0, event_type: String(cols.t?.get(idx) ?? ""),
            description: String(cols.d?.get(idx) ?? ""),
            lon: 0, lat: 0, verse_text_snippet: String(cols.v?.get(idx) ?? ""),
            primary_book: "", verse_reference: "",
          };
          setHoverInfo({ ...info, object: eventData });
        } else {
          setHoverInfo(null);
        }
      },
      onClick: (info: any) => {
        if (info.object !== undefined && info.index >= 0 && arrowTable) {
          const idx = info.object as number;
          // Create BibleEvent on-demand for selection (only when clicked)
          const cols = {
            n: arrowTable.getChild("name"),
            y: arrowTable.getChild("ussher_year"),
            e: arrowTable.getChild("epoch_id"),
            t: arrowTable.getChild("event_type"),
            d: arrowTable.getChild("description"),
            lo: arrowTable.getChild("lon"),
            la: arrowTable.getChild("lat"),
            v: arrowTable.getChild("verse_text_snippet"),
            pb: arrowTable.getChild("primary_book"),
            vr: arrowTable.getChild("verse_reference"),
          };
          const eventData: BibleEvent = {
            name: String(cols.n?.get(idx) ?? ""),
            ussher_year: Number(cols.y?.get(idx) ?? 0),
            epoch_id: Number(cols.e?.get(idx) ?? 0),
            event_type: String(cols.t?.get(idx) ?? ""),
            description: String(cols.d?.get(idx) ?? ""),
            lon: Number(cols.lo?.get(idx) ?? 0),
            lat: Number(cols.la?.get(idx) ?? 0),
            verse_text_snippet: String(cols.v?.get(idx) ?? ""),
            primary_book: String(cols.pb?.get(idx) ?? ""),
            verse_reference: String(cols.vr?.get(idx) ?? ""),
          };
          setSelectedEvent(eventData);
        }
      },
      extensions:      [new DataFilterExtension({ filterSize: 2 }), new CollisionFilterExtension()],
      getCollisionPriority: (idx: number) => {
        if (!arrowTable) return 0;
        const typeCol = arrowTable.getChild("event_type");
        const type = String(typeCol?.get(idx) ?? "");
        // Higher priority for important events (battles, miracles, etc.)
        const priorities: Record<string, number> = {
          battle: 10, miracle: 9, covenant: 8, prophecy: 7, 
          birth: 6, death: 6, building: 5, journey: 4, general: 1
        };
        return priorities[type] ?? 1;
      },
      getFilterValue: (idx: number) => {
        if (!arrowTable) return [0, 0];
        const yearCol = arrowTable.getChild("ussher_year");
        const epochCol = arrowTable.getChild("epoch_id");
        return [
          Number(yearCol?.get(idx) ?? 0),
          Number(epochCol?.get(idx) ?? 0)
        ];
      },
      filterRange:     [[minYear - 1, currentYear], [activeEpochId, activeEpochId]],
      filterSoftRange: [[currentYear - 200, currentYear], [activeEpochId, activeEpochId]],
      updateTriggers:  { 
        getPosition: [arrowTable],
        getFillColor: [arrowTable],
        getRadius: [arrowTable],
        getFilterValue: [currentYear, activeEpochId, arrowTable] 
      },
    } as any),
  ];

  if (loading) return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono">
      <div className="text-amber-500 text-2xl mb-6 font-bold tracking-wider">BibleMap</div>
      <div className="text-slate-300 mb-3 text-sm">{loadProgress.stage}</div>
      {loadProgress.total > 0 && (
        <>
          <div className="w-80 h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
              style={{ width: `${loadProgress.percent}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mb-4">
            {loadProgress.loaded}KB / {loadProgress.total}KB ({loadProgress.percent}%)
          </div>
        </>
      )}
      {/* Chunk loading status */}
      <div className="flex gap-2 mb-6">
        {['creation', 'patriarchs', 'exodus', 'kings', 'exile', 'intertestamental'].map((name, idx) => (
          <div
            key={name}
            className={`w-2 h-2 rounded-full transition-all ${
              loadedChunks.has(idx)
                ? 'bg-amber-500'
                : loadingChunks.has(idx)
                ? 'bg-amber-500/50 animate-pulse'
                : 'bg-slate-700'
            }`}
            title={name}
          />
        ))}
      </div>
      <div className="mt-4 max-w-md text-center px-8">
        <div className="text-[11px] text-slate-600 uppercase tracking-widest mb-3">Scripture</div>
        <div className="text-sm text-slate-500 italic leading-relaxed">
          "{randomQuote.current}"
        </div>
      </div>
      <div className="mt-8 text-[10px] text-slate-700 uppercase tracking-wider">
        Loading sacred geography...
      </div>
    </div>
  );

  return (
    <div className={`relative w-screen h-screen bg-slate-950 overflow-hidden font-sans text-slate-200 ${filmGrainEnabled ? 'film-grain' : ''} ${parchmentMode ? 'parchment-mode' : ''}`}>
      <style jsx global>{`
        .film-grain::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          mix-blend-mode: multiply;
          pointer-events: none;
          z-index: 9999;
        }
        .parchment-mode {
          filter: sepia(0.15) saturate(0.9) brightness(0.95) contrast(1.05);
        }
        .parchment-mode .bg-slate-900,
        .parchment-mode .bg-slate-950 {
          background-color: rgb(20, 16, 12) !important;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      <DeckGL
        initialViewState={INITIAL_VIEW}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller
        layers={layers}
        effects={[lightingEffect]}
        style={{ width: "100%", height: "100%" }}
        onClick={(info) => { if (!info.object) setSelectedEvent(null); }}
      >
        <Map ref={mapRef} mapStyle={MAP_STYLE} />
      </DeckGL>

      <Tooltip info={hoverInfo} />

      {/* Error banner for failed chunk loads */}
      {chunkErrors.has(activeEpochId) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-950/95 border border-red-800 rounded-lg px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="text-red-400 text-sm">
              Failed to load {EPOCHS[activeEpochId]?.name}. {chunkErrors.get(activeEpochId)}
            </div>
            <button 
              onClick={() => loadChunk(activeEpochId, 0)}
              className="px-3 py-1 bg-red-900 hover:bg-red-800 text-red-100 text-xs rounded transition-colors"
            >
              Retry {retryCount.get(activeEpochId) ? `(${retryCount.get(activeEpochId)}/3)` : ''}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[200] bg-slate-900/90 border border-slate-700 p-3 rounded-full shadow-lg text-amber-500"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* TOP LEFT SIDEBAR - Command Center */}
      <div className={`fixed md:absolute top-4 left-4 z-50 w-80 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl flex flex-col gap-4 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] md:translate-x-0'}`}>
        <div className="flex flex-col border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-200 tracking-tight">BibleExplorer</h2>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Explore the stories of the Bible in a way you never have.
          </p>
        </div>

        <div className="relative flex items-center">
          <Search className={`absolute left-3 w-4 h-4 transition-colors ${journeyQuery.trim() ? 'text-amber-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search journeys (e.g. paul, red sea)"
            value={journeyQuery}
            onChange={(e) => setJourneyQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && activeJourneys.length > 0) {
                const firstMatch = activeJourneys[0];
                stopAnim();

                // 1. Change epoch if necessary to ensure the layer renders
                if (firstMatch.epoch_id !== activeEpochId) {
                  setActiveEpochId(firstMatch.epoch_id);
                  const targetEpoch = EPOCHS.find(ep => ep.id === firstMatch.epoch_id);
                  if (targetEpoch) {
                    const bookSuffix = selectedBook !== "All" ? `&book=${selectedBook}` : "";
                    window.history.replaceState(null, "", `${targetEpoch.hash}${bookSuffix}`);
                  }
                }

                // 2. Jump the WebGL timeline directly to the START of the glowing journey
                if (firstMatch.timestamps && firstMatch.timestamps.length > 0) {
                  setCurrentYear(firstMatch.timestamps[0]);
                } else {
                  // Fallback to epoch start if no timestamps exist - read from Arrow
                  if (arrowTable) {
                    const epochCol = arrowTable.getChild("epoch_id");
                    const yearCol = arrowTable.getChild("ussher_year");
                    let minYearForEpoch = Infinity;
                    for (const idx of filteredIndices) {
                      if (Number(epochCol?.get(idx)) === firstMatch.epoch_id) {
                        const year = Number(yearCol?.get(idx) ?? 0);
                        if (year < minYearForEpoch) minYearForEpoch = year;
                      }
                    }
                    if (minYearForEpoch !== Infinity) {
                      setCurrentYear(minYearForEpoch);
                    }
                  }
                }
              }
            }}
            className={`w-full bg-slate-800 border rounded-lg pl-9 pr-10 py-2 text-sm text-slate-200 focus:outline-none transition-colors ${journeyQuery.trim() ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'border-slate-600 focus:border-amber-500'}`}
          />
          {journeyQuery && (
            <button
              onClick={() => setJourneyQuery("")}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            aria-label="Filter by book"
            value={selectedBook}
            onChange={(ev) => handleBookChange(ev.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 appearance-none transition-colors"
          >
            {uniqueBooks.map((book) => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>

        <div className="relative flex items-center">
          <Search className={`absolute left-3 w-4 h-4 transition-colors ${eventSearchQuery.trim() ? 'text-amber-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search events (min 2 chars)"
            value={eventSearchQuery}
            onChange={(e) => setEventSearchQuery(e.target.value)}
            className={`w-full bg-slate-800 border rounded-lg pl-9 pr-10 py-2 text-sm text-slate-200 focus:outline-none transition-colors ${eventSearchQuery.trim() ? 'border-amber-500/50' : 'border-slate-600 focus:border-amber-500'}`}
          />
          {eventSearchQuery && (
            <button
              onClick={() => setEventSearchQuery("")}
              className="absolute right-3 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider px-1">
          <span>
            {filteredIndices.length} events visible
            {eventSearchQuery.length >= 2 && arrowTable && (
              <span className="text-amber-500/70"> • {arrowTable.numRows - filteredIndices.length} filtered</span>
            )}
          </span>
          {eventSearchQuery.length >= 2 && (
            <span className="text-amber-500">
              {filteredIndices.length} results
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Historical Epochs</h2>
          {EPOCHS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                stopAnim();
                setActiveEpochId(ep.id);
                setIsSidebarOpen(false);
                const bookSuffix = selectedBook !== "All" ? `&book=${selectedBook}` : "";
                window.history.replaceState(null, "", `${ep.hash}${bookSuffix}`);
                // Read from Arrow table instead of filtered events array
                if (arrowTable) {
                  const epochCol = arrowTable.getChild("epoch_id");
                  const yearCol = arrowTable.getChild("ussher_year");
                  let minYearForEpoch = Infinity;
                  for (const idx of filteredIndices) {
                    if (Number(epochCol?.get(idx)) === ep.id) {
                      const year = Number(yearCol?.get(idx) ?? 0);
                      if (year < minYearForEpoch) minYearForEpoch = year;
                    }
                  }
                  if (minYearForEpoch !== Infinity) {
                    setCurrentYear(minYearForEpoch);
                  }
                }
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${ep.id === activeEpochId ? 'bg-amber-600/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700'}`}
            >
              {ep.name}
            </button>
          ))}
        </div>

        {/* Cinematic Controls */}
        <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-700/50">
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Visual FX
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFilmGrainEnabled(!filmGrainEnabled)}
              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all border ${
                filmGrainEnabled 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              Film Grain
            </button>
            <button
              onClick={() => setParchmentMode(!parchmentMode)}
              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all border ${
                parchmentMode 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              Parchment
            </button>
            <button
              onClick={() => setShowJourneyPaths(!showJourneyPaths)}
              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all border col-span-2 ${
                showJourneyPaths 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Navigation className="w-3 h-3 inline mr-1" />
              Journey Trails
            </button>
            <button
              onClick={() => setAmbientEnabled(!ambientEnabled)}
              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all border col-span-2 ${
                ambientEnabled 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              Ambient Soundscape
            </button>
          </div>
          
          {/* Journey Mode Selector */}
          <div className="mt-3 pt-3 border-t border-slate-700/30">
            <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Journey Mode
            </h3>
            <select
              value={journeyMode || ''}
              onChange={(e) => {
                const mode = e.target.value || null;
                setJourneyMode(mode);
                if (mode && JOURNEY_DEFINITIONS[mode]) {
                  const journey = JOURNEY_DEFINITIONS[mode];
                  // Fly to first waypoint
                  if (mapRef.current && journey.waypoints[0]) {
                    mapRef.current.flyTo({
                      center: [journey.waypoints[0].lon, journey.waypoints[0].lat],
                      zoom: 6,
                      duration: 1200
                    });
                  }
                  setJourneyProgress(0);
                }
              }}
              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="">Select a journey...</option>
              {Object.entries(JOURNEY_DEFINITIONS).map(([key, journey]) => (
                <option key={key} value={key}>{journey.name}</option>
              ))}
            </select>
            {journeyMode && (
              <div className="mt-2">
                <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(journeyProgress * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out"
                    style={{ width: `${journeyProgress * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chunk Loading Indicator */}
        <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-700/50">
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Data Chunks
          </h2>
          <div className="flex flex-col gap-1.5">
            {EPOCHS.map((epoch, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded transition-all ${
                  loadedChunks.has(i) 
                    ? 'text-amber-400 bg-amber-500/10' 
                    : loadingChunks.has(i)
                    ? 'text-amber-500/70 bg-amber-500/5'
                    : chunkErrors.has(i)
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-slate-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  loadedChunks.has(i)
                    ? 'bg-amber-500'
                    : loadingChunks.has(i)
                    ? 'bg-amber-500 animate-pulse'
                    : chunkErrors.has(i)
                    ? 'bg-red-500'
                    : 'bg-slate-700'
                }`} />
                <span className="flex-1 truncate">{epoch.name}</span>
                {loadingChunks.has(i) && (
                  <span className="text-[9px] text-slate-500">...</span>
                )}
                {chunkErrors.has(i) && (
                  <span className="text-[9px]">✕</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR - Narrative Scrubber */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-10 flex flex-col items-center gap-3">
        <div className="flex justify-between items-end w-full px-2">
          <div className="hidden md:block text-slate-400 text-xs">{EPOCHS[activeEpochId]?.description}</div>
          <div className="text-2xl font-bold text-amber-500 tabular-nums w-full md:w-auto text-center md:text-right">
            {currentYear < 0 ? `${Math.abs(Math.round(currentYear))} BC` : `${Math.round(currentYear)} AD`}
          </div>
        </div>

        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(ev) => { stopAnim(); setCurrentYear(Number(ev.target.value)); }}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
          aria-label="Timeline year"
        />

        <div className="flex gap-4 w-full justify-center">
          <button onClick={startAnim} className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-200">
            <Play className="w-4 h-4 text-amber-500" /> Play Era
          </button>
          <button onClick={stopAnim} className="flex items-center justify-center gap-2 flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-200">
            <Pause className="w-4 h-4 text-amber-500" /> Pause
          </button>
        </div>
      </div>

      {/* Event Detail Panel v4 - Premium Cinematic Redesign */}
      {selectedEvent && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:backdrop-blur-[2px] md:bg-black/20 transition-opacity duration-300"
            onClick={() => setSelectedEvent(null)}
            aria-hidden="true"
          />
          
          {/* Panel v4 - Fixed position, no layout shift */}
          <div 
            className={`
              fixed z-40 flex flex-col
              md:top-0 md:right-0 md:h-screen md:w-[400px] md:max-w-[400px]
              bottom-0 left-0 right-0 h-[65vh] min-h-[400px] max-h-[85vh]
              md:rounded-none rounded-t-[24px]
              bg-[#fefcf8]/[0.98] backdrop-blur-xl
              md:border-l border-t md:border-t-0 border-black/[0.06]
              md:shadow-[-4px_0_24px_rgba(0,0,0,0.08)] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]
              transition-transform duration-[300ms] ease-[cubic-bezier(0.2,0,0,1)]
              will-change-transform
              ${selectedEvent 
                ? 'translate-y-0 md:translate-x-0' 
                : 'translate-y-full md:translate-x-full md:translate-y-0'
              }
            `}
            role="dialog"
            aria-modal="true"
            aria-label="Event details"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              (e.currentTarget as any)._touchStartY = touch.clientY;
              (e.currentTarget as any)._touchStartTime = Date.now();
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const startY = (e.currentTarget as any)._touchStartY || 0;
              const deltaY = touch.clientY - startY;
              
              // Only allow downward swipe on mobile, and only if at top of scroll
              if (window.innerWidth < 768 && deltaY > 0) {
                const scrollContainer = e.currentTarget.querySelector('[data-scroll-container]');
                if (scrollContainer && scrollContainer.scrollTop === 0) {
                  e.currentTarget.style.transform = `translateY(${Math.min(deltaY, 200)}px)`;
                }
              }
            }}
            onTouchEnd={(e) => {
              const touch = e.changedTouches[0];
              const startY = (e.currentTarget as any)._touchStartY || 0;
              const startTime = (e.currentTarget as any)._touchStartTime || 0;
              const deltaY = touch.clientY - startY;
              const deltaTime = Date.now() - startTime;
              const velocity = deltaY / deltaTime;
              
              // Reset transform
              e.currentTarget.style.transform = '';
              
              // Dismiss if swiped down enough or with velocity
              if (window.innerWidth < 768 && (deltaY > 100 || velocity > 0.5)) {
                setSelectedEvent(null);
              }
            }}
          >
            {/* Film Grain Texture - 0.02 opacity */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Mobile Drag Handle - 36px wide, 4px height, 8px margin */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 rounded-full bg-stone-300" />
            </div>
            
            {/* Close Button - Desktop only */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="hidden md:flex absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-full text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors z-10"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Scrollable Content with staggered animations */}
            <div 
              data-scroll-container
              className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="px-5 md:px-7 pt-4 md:pt-10 pb-8 space-y-6">
                
                {/* Header Group */}
                <div className="space-y-2 animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:50ms]">
                  {/* Title - Playfair Display, clamp(24px, 4vw, 32px), weight 600 */}
                  <h1 
                    className="text-[clamp(24px,4vw,32px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1c1917] [font-family:'Playfair_Display',Georgia,serif]"
                  >
                    {selectedEvent.name}
                  </h1>
                  
                  {/* Date/Location - Geist Sans, 11px, uppercase, letter-spacing 0.05em */}
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] text-[#78716c] [font-family:'Geist_Sans',system-ui,sans-serif]">
                    <span>
                      {selectedEvent.ussher_year < 0 
                        ? `${Math.abs(Math.round(selectedEvent.ussher_year))} BC` 
                        : `${Math.round(selectedEvent.ussher_year)} AD`}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span>{selectedEvent.primary_book || 'Biblical Lands'}</span>
                  </div>
                </div>
                
                {/* Audio Narration Controls */}
                <div className="animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:75ms] flex items-center gap-2">
                  <button
                    onClick={() => isPlayingAudio ? stopNarration() : playNarration(selectedEvent.name, selectedEvent.name)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d97706]/10 hover:bg-[#d97706]/20 border border-[#d97706]/20 transition-all duration-200"
                    aria-label={isPlayingAudio ? "Pause narration" : "Play narration"}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-3.5 h-3.5 text-[#d97706] group-hover:scale-110 transition-transform" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-[#d97706] group-hover:scale-110 transition-transform fill-current" />
                    )}
                    <span className="text-[10.5px] font-medium uppercase tracking-wider text-[#92400e] [font-family:'Geist_Sans',system-ui,sans-serif]">
                      {isPlayingAudio ? 'Pause' : 'Listen'}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5 ml-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={audioVolume}
                      onChange={(e) => {
                        const vol = parseFloat(e.target.value);
                        setAudioVolume(vol);
                        if (audioElement) audioElement.volume = vol;
                      }}
                      className="w-16 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#d97706]"
                      aria-label="Volume"
                    />
                  </div>
                </div>
                
                {/* Key Verse Block - Full bleed, Playfair italic */}
                {selectedEvent.verse_text_snippet && (
                  <div className="animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:100ms] -mx-5 md:-mx-7">
                    <div className="bg-[#fef3c7] border-l-[3px] border-[#d97706] px-5 md:px-7 py-4">
                      <p className="text-[17px] leading-[1.65] text-[#44403c] italic [font-family:'Playfair_Display',Georgia,serif]">
                        "{selectedEvent.verse_text_snippet}"
                      </p>
                      {selectedEvent.verse_reference && (
                        <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[#78716c] [font-family:'Geist_Sans',system-ui,sans-serif]">
                          — {selectedEvent.verse_reference}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Summary - Geist Sans, 14.5px, line-height 1.7 */}
                <div className="animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:150ms] space-y-3">
                  <p className="text-[14.5px] leading-[1.7] text-[#44403c] [font-family:'Geist_Sans',system-ui,sans-serif]">
                    {(() => {
                      // Try to find curated summary by matching event name
                      const eventNameLower = selectedEvent.name.toLowerCase();
                      for (const [key, summary] of Object.entries(CURATED_SUMMARIES)) {
                        if (eventNameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(eventNameLower.split(' ')[0])) {
                          return summary;
                        }
                      }
                      // Fallback: truncate long description to first 2 sentences
                      const desc = selectedEvent.description || '';
                      const sentences = desc.match(/[^.!?]+[.!?]+/g) || [desc];
                      return sentences.slice(0, 2).join(' ').trim() || desc.slice(0, 200) + '...';
                    })()}
                  </p>
                  {/* Expand to full description */}
                  {selectedEvent.description && selectedEvent.description.length > 200 && (
                    <details className="group">
                      <summary className="cursor-pointer text-[11px] font-medium uppercase tracking-wider text-[#78716c] hover:text-[#57534e] transition-colors list-none flex items-center gap-1">
                        <span>Read full account</span>
                        <span className="transition-transform group-open:rotate-90">›</span>
                      </summary>
                      <p className="mt-3 text-[13px] leading-[1.65] text-[#57534e] [font-family:'Geist_Sans',system-ui,sans-serif] border-l-2 border-stone-200 pl-3">
                        {selectedEvent.description}
                      </p>
                    </details>
                  )}
                </div>
                
                {/* Tags */}
                <div className="animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:200ms] flex flex-wrap gap-1.5">
                  {[selectedEvent.event_type, selectedEvent.primary_book]
                    .filter(Boolean)
                    .map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-stone-100 text-[10px] font-medium uppercase tracking-wide text-stone-600 [font-family:'Geist_Sans',system-ui,sans-serif]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Related Events Section */}
                {(relatedEvents.before.length > 0 || relatedEvents.after.length > 0 || relatedEvents.nearby.length > 0) && (
                  <div className="animate-[fadeInUp_0.4s_ease-out_forwards] opacity-0 [animation-delay:250ms] pt-2 border-t border-stone-200">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500 mb-3 [font-family:'Geist_Sans',system-ui,sans-serif]">
                      Related Events
                    </h3>
                    
                    <div className="flex gap-2.5 overflow-x-auto -mx-1 px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {[...relatedEvents.before.slice(-2).reverse(), ...relatedEvents.after.slice(0, 3)]
                        .filter((ev, idx, arr) => ev && arr.findIndex(e => e.name === ev.name) === idx)
                        .slice(0, 5)
                        .map((ev) => (
                        <button
                          key={ev.name}
                          onClick={() => {
                            setSelectedEvent(ev);
                            if (mapRef.current) {
                              mapRef.current.flyTo({ 
                                center: [ev.lon, ev.lat], 
                                zoom: 7, 
                                duration: 600 
                              });
                            }
                          }}
                          className="group flex-shrink-0 w-[140px] text-left p-3 rounded-[12px] bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
                        >
                          <div className="text-[13px] leading-[1.35] text-stone-800 font-medium line-clamp-2 mb-1.5 [font-family:'Geist_Sans',system-ui,sans-serif] group-hover:text-stone-900">
                            {ev.name}
                          </div>
                          <div className="text-[10px] text-stone-500 [font-family:'Geist_Sans',system-ui,sans-serif]">
                            {Math.abs(ev.ussher_year)} {ev.ussher_year < 0 ? 'BC' : 'AD'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {filteredIndices.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 border border-slate-700 rounded-xl px-6 py-4 text-slate-400 text-center shadow-2xl pointer-events-none">
          No events found for <strong className="text-amber-500">{selectedBook}</strong> in {EPOCHS[activeEpochId]?.name}
        </div>
      )}

      {showVerseModal && selectedEvent?.verse_reference && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowVerseModal(false)}>
          <div className="bg-slate-900 border border-slate-700 w-full rounded-t-3xl fixed bottom-0 max-h-[90vh] md:relative md:bottom-auto md:rounded-2xl md:max-w-2xl md:w-full md:mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-500">{selectedEvent.verse_reference}</h3>
              <button onClick={() => setShowVerseModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-slate-300 leading-relaxed max-h-[70vh] overflow-y-auto">
              <p className="italic mb-8 text-lg">&ldquo;{selectedEvent.verse_text_snippet}&rdquo;</p>
              <a
                href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(selectedEvent.verse_reference)}&version=KJV`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg transition-colors"
              >
                Read Full Chapter on BibleGateway →
              </a>
              <div className="text-xs text-slate-500 mt-4 text-center">
                Context: {EPOCHS[activeEpochId]?.name} • {selectedEvent.event_type}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
