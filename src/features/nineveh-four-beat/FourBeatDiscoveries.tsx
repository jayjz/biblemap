import Image from "next/image";
import type { MouseEvent } from "react";
import { depthSources, depthVoices } from "@/content/nineveh-depth";
import media from "@/features/nineveh/depth-media.json";

export type Navigate = (event: MouseEvent<HTMLElement>, hash: string) => void;
export function FourBeatDiscoveries({ beat, discovery, navigate }: { beat: string; discovery: string | null; navigate: Navigate }) {
  const kind = beat === "anger" ? "voices" : beat === "question" ? "art" : "world";
  const asset = media.assets.find(item => item.id === (kind === "art" ? "jonah-vine" : "flood-tablet"));
  const summary = kind === "world" ? "A city that kept stories in clay" : kind === "voices" ? "Two readings beside the anger" : "A body beneath the leaves";
  return <details className={`fb-discovery fb-discovery-${kind}`} id={`${beat}/${kind}`} open={discovery === kind}>
    <summary onClick={event => navigate(event, discovery === kind ? beat : `${beat}/${kind}`)}>
      {kind !== "voices" && asset && <Image src={asset.publicUrl} width={asset.width} height={asset.height} alt="" unoptimized />}
      <span><small>{kind === "world" ? "An object from Nineveh · 7th century BCE" : kind === "voices" ? "Optional interpretation · Augustine / Francis" : "Later artistic reception · 280–290 CE"}</small>{summary}<em>Look closer <span aria-hidden="true">+</span></em></span>
    </summary>
    <div className="fb-discovery-body">
      {kind === "world" && asset ? <>
        <h3>The Flood Tablet</h3>
        <div className="fb-object-reading"><figure><Image src={asset.publicUrl} width={asset.width} height={asset.height} alt={asset.altText} unoptimized /><figcaption>{asset.requiredAttribution} <a href={asset.licenseUrl}>Image license</a></figcaption></figure>
          <div><p>Historical artifact · British Museum K.3375</p><p>A clay manuscript of the Epic of Gilgamesh, tablet XI, excavated at Kouyunjik, Nineveh. This surviving object belongs to the seventh century BCE, later than Jonah’s traditional eighth-century setting.</p><p>It is not a record of Nineveh’s repentance or evidence that Jonah visited. Its placement here connects the biblical city with a place where people preserved writing.</p><a href={depthSources.tablet.url}>Inspect the museum record</a><details><summary>What can the library tell us?</summary><p>Ashurbanipal’s collection preserves literary, medical, divinatory and administrative writing. Its original arrangement and the findspots of many tablets remain uncertain.</p><a href={depthSources.library.url}>Jonathan Taylor · What is the Library? (2022)</a></details></div></div>
      </> : kind === "voices" ? <>
        <h3>What do readers notice here?</h3><p>Attributed interpretations, not a diagnosis of Jonah. These two Christian readings ask different questions; neither supplies the book’s missing final reply.</p>
        <div className="fb-voices">{depthVoices.map(voice => <section key={voice.id}><p>{voice.era}</p><h4>{voice.author}</h4><h5>{voice.title}</h5><p>{voice.paraphrase}</p><p className="fb-note">{voice.context}</p><a href={depthSources[voice.id].url}>Read the source</a><details><summary>Edition and limits</summary><p>{voice.edition}</p><p>{voice.rights}</p></details></section>)}</div>
      </> : asset ? <>
        <h3>Jonah Under the Gourd Vine</h3><figure><Image src={asset.publicUrl} width={asset.width} height={asset.height} alt={asset.altText} unoptimized /><figcaption>{asset.requiredAttribution}</figcaption></figure><p>Later Christian artistic reception · Unknown sculptor, Anatolia, 280–290 CE. Marble. Not a portrait of Jonah or a reconstruction of Assyrian life.</p><p>The shelter of the leaves belongs beside Jonah 4:5–10. The sculptor gives that shelter a bodily form. The work does not establish the plant’s species or answer the final question.</p><a href={asset.sourceRecordUrl}>Explore the Cleveland Museum of Art record</a><a href={asset.licenseUrl}>CC0 image rights</a>
      </> : <p>The object record is unavailable. Continue with Scripture.</p>}
      <a className="fb-return" href={`#${beat}`} onClick={event => navigate(event,beat)}>Return to Scripture</a>
    </div>
  </details>;
}
