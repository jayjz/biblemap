import { MOTION } from "@/scenes/motion";
import type { SceneBeat } from "@/scenes/orchestrateScene";

/**
 * Authored scene sequences. Each beat is a place, a camera, an artwork cue,
 * and a narration transcript — not a database pin with a timeout.
 */
export const JOURNEY_SCENES: Record<string, SceneBeat[]> = {
  exodus: [
    {
      sceneId: "exodus-egypt",
      eventId: "moses-birth",
      title: "Israel in Egypt",
      description: "A people under empire, waiting for a name to be drawn from the water.",
      year: -1446,
      camera: {
        longitude: 31.2357,
        latitude: 30.0444,
        zoom: 6.4,
        pitch: 42,
        bearing: -18,
        durationMs: MOTION.cameraMs,
      },
      durationMs: 9000,
      scripture: {
        text: "She named him Moses, saying, 'I drew him out of the water.'",
        reference: "Exodus 2:10",
      },
      narration: {
        transcript:
          "In Egypt a people wait. A child is hidden among reeds, then drawn out of the water. The land is real; the Nile still turns. What follows is a journey, not a single miracle.",
        startMs: 0,
      },
    },
    {
      sceneId: "exodus-sea",
      eventId: "exodus-red-sea",
      title: "The sea",
      description: "Trapped between chariots and water, Israel is told only to be still.",
      year: -1446,
      camera: {
        longitude: 32.8,
        latitude: 29.5,
        zoom: 7.3,
        pitch: 52,
        bearing: 22,
        durationMs: 2000,
      },
      mediaId: "poussin-crossing-red-sea",
      durationMs: 11000,
      scripture: {
        text: "The Lord will fight for you; you need only to be still.",
        reference: "Exodus 14:14",
      },
      narration: {
        transcript:
          "Poussin painted this crossing two millennia later. Hold the painting as reception, not evidence. The map still has to choose a shore. Scholars still dispute which water, and when.",
        startMs: 0,
      },
    },
    {
      sceneId: "exodus-sinai",
      eventId: "sinai-covenant",
      title: "Sinai",
      description: "A mountain of fire and a people asked to belong.",
      year: -1446,
      camera: {
        longitude: 33.9,
        latitude: 28.5,
        zoom: 7.6,
        pitch: 55,
        bearing: -8,
        durationMs: 2000,
      },
      mediaId: "rembrandt-moses-tablets",
      durationMs: 11000,
      scripture: {
        text: "Now if you obey me fully and keep my covenant, then out of all nations you will be my treasured possession.",
        reference: "Exodus 19:5",
      },
      narration: {
        transcript:
          "Rembrandt's Moses is a man under the weight of words. The mountain's location is still argued. The covenant's claim does not depend on our camera.",
        startMs: 0,
      },
    },
    {
      sceneId: "exodus-kadesh",
      title: "Kadesh Barnea",
      description: "The edge of promise, and the long delay.",
      year: -1445,
      camera: {
        longitude: 34.5,
        latitude: 30.7,
        zoom: 7.1,
        pitch: 44,
        bearing: 12,
        durationMs: MOTION.cameraMsNear,
      },
      durationMs: 8000,
      narration: {
        transcript:
          "Here the journey slows. Forty years are a theological claim and a wilderness of disputed camps. We do not pretend to stand in a verified courtyard.",
        startMs: 0,
      },
    },
    {
      sceneId: "exodus-moab",
      title: "Plains of Moab",
      description: "A last address, looking west toward a land Moses will not enter.",
      year: -1406,
      camera: {
        longitude: 35.7,
        latitude: 31.7,
        zoom: 7.4,
        pitch: 50,
        bearing: -28,
        durationMs: 2000,
      },
      durationMs: 9000,
      narration: {
        transcript:
          "From Moab the Jordan is a short descent. The story turns from road to inheritance. We leave the camera here, looking across.",
        startMs: 0,
      },
    },
  ],
  paul1: [
    {
      sceneId: "paul-antioch",
      eventId: "pauls-conversion",
      title: "Sent from Antioch",
      description: "A church that prays, and a man whose name has already been changed.",
      year: 46,
      camera: {
        longitude: 36.16,
        latitude: 36.2,
        zoom: 6.8,
        pitch: 46,
        bearing: 10,
        durationMs: MOTION.cameraMs,
      },
      mediaId: "caravaggio-conversion-damascus",
      durationMs: 11000,
      scripture: {
        text: "This man is my chosen instrument to proclaim my name to the Gentiles and their kings and to the people of Israel.",
        reference: "Acts 9:15",
      },
      narration: {
        transcript:
          "Caravaggio paints the fall, not the road. Antioch is where the sending begins. The conversion was inland, toward Damascus; the mission will face the sea.",
        startMs: 0,
      },
    },
    {
      sceneId: "paul-cyprus",
      title: "Cyprus",
      description: "A proconsul, a magician, and a name spoken in a Roman hall.",
      year: 46,
      camera: {
        longitude: 33.0,
        latitude: 35.0,
        zoom: 7.0,
        pitch: 40,
        bearing: -16,
        durationMs: MOTION.cameraMsNear,
      },
      durationMs: 8000,
      narration: {
        transcript:
          "The island sits in the path of every empire's shipping. Acts places Paul and Barnabas here first. We fly because the story moves; we do not reconstruct the praetorium.",
        startMs: 0,
      },
    },
    {
      sceneId: "paul-pisidian",
      title: "Pisidian Antioch",
      description: "Gentiles rejoice, and a synagogue divides.",
      year: 47,
      camera: {
        longitude: 31.2,
        latitude: 38.3,
        zoom: 7.2,
        pitch: 48,
        bearing: 6,
        durationMs: 2000,
      },
      durationMs: 8000,
      narration: {
        transcript:
          "High on the Anatolian plateau, a Roman colony hears a Sabbath sermon that will not stay in one people. The map tightens. The argument widens.",
        startMs: 0,
      },
    },
    {
      sceneId: "paul-iconium",
      title: "Iconium",
      description: "Signs, and a city split.",
      year: 47,
      camera: {
        longitude: 32.5,
        latitude: 37.87,
        zoom: 7.4,
        pitch: 44,
        bearing: 14,
        durationMs: MOTION.cameraMsNear,
      },
      durationMs: 7000,
    },
    {
      sceneId: "paul-lystra",
      title: "Lystra and Derbe",
      description: "Mistaken for gods, then left for dead.",
      year: 47,
      camera: {
        longitude: 33.0,
        latitude: 37.5,
        zoom: 7.3,
        pitch: 50,
        bearing: -10,
        durationMs: MOTION.cameraMsNear,
      },
      durationMs: 8000,
      narration: {
        transcript:
          "Lystra is where the crowd's theology fails: they would crown the messengers. Then stones. The road does not get smoother. It gets truer.",
        startMs: 0,
      },
    },
  ],
  jesus_ministry: [
    {
      sceneId: "jesus-nazareth",
      eventId: "birth-of-jesus",
      title: "Nazareth",
      description: "A hometown that cannot hear a prophet.",
      year: 27,
      camera: {
        longitude: 35.3,
        latitude: 32.7,
        zoom: 8.2,
        pitch: 50,
        bearing: -14,
        durationMs: MOTION.cameraMs,
      },
      mediaId: "giotto-nativity",
      durationMs: 10000,
      scripture: {
        text: "Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.",
        reference: "Luke 2:11",
      },
      narration: {
        transcript:
          "Giotto's nativity is Paduan, not Galilean. We begin in Nazareth because ministry begins where a person is known too well. Bethlehem remains a separate birth-place on this map.",
        startMs: 0,
      },
    },
    {
      sceneId: "jesus-capernaum",
      title: "Capernaum",
      description: "A fishing town becomes a headquarters.",
      year: 27,
      camera: {
        longitude: 35.575,
        latitude: 32.88,
        zoom: 9.0,
        pitch: 54,
        bearing: 20,
        durationMs: 2000,
      },
      durationMs: 8000,
      narration: {
        transcript:
          "The lake is still here. First-century basalt walls still rise at Capernaum. We draw closer because the Gospels do.",
        startMs: 0,
      },
    },
    {
      sceneId: "jesus-galilee",
      title: "The lake",
      description: "Wind, water, and a voice over both.",
      year: 28,
      camera: {
        longitude: 35.58,
        latitude: 32.81,
        zoom: 8.6,
        pitch: 58,
        bearing: -6,
        durationMs: MOTION.cameraMsNear,
      },
      durationMs: 8000,
    },
    {
      sceneId: "jesus-caesarea-philippi",
      title: "Caesarea Philippi",
      description: "A confession at the springs of the Jordan.",
      year: 29,
      camera: {
        longitude: 35.695,
        latitude: 33.248,
        zoom: 8.4,
        pitch: 52,
        bearing: 16,
        durationMs: 2000,
      },
      durationMs: 8000,
      scripture: {
        text: "You are the Messiah, the Son of the living God.",
        reference: "Matthew 16:16",
      },
    },
    {
      sceneId: "jesus-transfiguration",
      eventId: "transfiguration",
      title: "The mountain",
      description: "A glimpse of glory, then the valley again.",
      year: 29,
      camera: {
        longitude: 35.39,
        latitude: 32.7,
        zoom: 8.5,
        pitch: 56,
        bearing: -22,
        durationMs: 2000,
      },
      durationMs: 10000,
      scripture: {
        text: "This is my Son, whom I love; with him I am well pleased. Listen to him!",
        reference: "Matthew 17:5",
      },
      narration: {
        transcript:
          "The transfiguration mountain is unnamed. Tabor is traditional; Hermon is argued. We do not settle it. No approved image is attached, so the land itself has to carry the moment.",
        startMs: 0,
      },
    },
  ],
};

export function journeySceneCount(journeyId: string): number {
  return JOURNEY_SCENES[journeyId]?.length ?? 0;
}
