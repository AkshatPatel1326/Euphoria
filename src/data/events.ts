export type EventCategory = "cultural" | "literary-management" | "science-tech" | "sports";

export interface EuphoriaEvent {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  poster: string | null;
  registrationStatus: "coming-soon" | "open" | "closed";
  time: string;
  venue: string;
  teamSize: string;
  prizes: string;
  rules: string;
}

export const categoryMeta: Record<
  EventCategory,
  { label: string; icon: string; color: string; gradient: string; description: string }
> = {
  cultural: {
    label: "Cultural",
    icon: "🎭",
    color: "#A232A0",
    gradient: "from-euphoria-plum to-euphoria-purple",
    description:
      "Dance, music, fashion, and visual arts — where raw talent meets the stage.",
  },
  "literary-management": {
    label: "Literary & Management",
    icon: "📚",
    color: "#AF9947",
    gradient: "from-amber-700 to-euphoria-gold",
    description:
      "Debate, strategy, branding, and innovation — where ideas are sharpened.",
  },
  "science-tech": {
    label: "Science & Technology",
    icon: "🔬",
    color: "#3EEED5",
    gradient: "from-euphoria-teal to-euphoria-aqua",
    description:
      "Innovation, research, and AI — where the future is built.",
  },
  sports: {
    label: "Sports",
    icon: "⚡",
    color: "#176F63",
    gradient: "from-emerald-800 to-euphoria-teal",
    description:
      "Competition, endurance, and strategy — where champions are made.",
  },
};

export const events: EuphoriaEvent[] = [
  // Cultural
  {
    id: "cultural-1",
    name: "Move & Groove — Solo Dance",
    category: "cultural",
    description:
      "A solo dance competition celebrating artistry, rhythm, and stage presence.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 10:00 AM",
    venue: "Main Stage",
    teamSize: "Individual",
    prizes: "Cash prizes + Trophy",
    rules:
      "Solo performers only. Two rounds: preliminary and final. Any dance style accepted. Time limit: 4 minutes per performance.",
  },
  {
    id: "cultural-2",
    name: "Move & Groove — Group Dance",
    category: "cultural",
    description:
      "Choreographed group performances judged on synchronization, creativity, and impact.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 2:00 PM",
    venue: "Main Stage",
    teamSize: "5–15 members",
    prizes: "Cash prizes + Trophy",
    rules:
      "Groups of 5 to 15. Original choreography preferred. Two rounds: preliminary and final. Time limit: 7 minutes.",
  },
  {
    id: "cultural-3",
    name: "Swar Fiesta — Solo Singing",
    category: "cultural",
    description:
      "A solo singing competition for vocalists who command the stage with range and emotion.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 11:00 AM",
    venue: "Auditorium",
    teamSize: "Individual",
    prizes: "Cash prizes + Trophy",
    rules:
      "Solo vocals only. Two rounds: elimination and finale. Any genre. Backing tracks permitted. Time limit: 5 minutes.",
  },
  {
    id: "cultural-4",
    name: "Battle of Bands",
    category: "cultural",
    description:
      "Live band performances competing for the title of best ensemble on campus.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 6:00 PM",
    venue: "Main Stage",
    teamSize: "4–8 members",
    prizes: "Cash prizes + Trophy + Studio session",
    rules:
      "Live performance required. Minimum 4, maximum 8 members. Original compositions and covers accepted. Time limit: 20 minutes.",
  },
  {
    id: "cultural-5",
    name: "Rap Battle",
    category: "cultural",
    description:
      "A head-to-head rap competition testing lyrical skill, delivery, and crowd presence.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 4:00 PM",
    venue: "Main Stage",
    teamSize: "Individual",
    prizes: "Cash prizes + Trophy",
    rules:
      "One-on-one elimination format. 60-second rounds. Crowd vote counts for 50%. No explicit content.",
  },
  {
    id: "cultural-6",
    name: "Fashion-Fiesta — Solo Model",
    category: "cultural",
    description:
      "Solo runway competition for models who combine confidence with craft.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 11:00 AM",
    venue: "Fashion Arena",
    teamSize: "Individual",
    prizes: "Cash prizes + Modelling contracts",
    rules:
      "Solo runway walk. Thematic and freestyle rounds. Judged on confidence, walk, and presentation.",
  },
  {
    id: "cultural-7",
    name: "Fashion-Fiesta — Designer Round",
    category: "cultural",
    description:
      "A design showcase where emerging fashion talent presents original collections.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 2:00 PM",
    venue: "Fashion Arena",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Mentorship opportunity",
    rules:
      "Present 3–5 original pieces. Theme provided 48 hours before event. Judged on creativity, construction, and presentation.",
  },
  {
    id: "cultural-8",
    name: "Model Hunt — Audition",
    category: "cultural",
    description:
      "Open auditions for aspiring models seeking their break into the spotlight.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 9:00 AM",
    venue: "Fashion Arena",
    teamSize: "Individual",
    prizes: "Portfolio shoots + Feature opportunities",
    rules:
      "Open to all. Walk, introduction, and talent round. No prior experience required.",
  },
  {
    id: "cultural-9",
    name: "Reel & Photography",
    category: "cultural",
    description:
      "A visual storytelling competition spanning reels, photography, and short-form content.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 3:00 PM",
    venue: "Digital Lab",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Camera gear",
    rules:
      "Submit 1 reel (60–90 seconds) and 5 photographs. Theme: Euphoria on campus. Edited content accepted.",
  },

  // Literary & Management
  {
    id: "lit-1",
    name: "Crack the Clue — Treasure Hunt",
    category: "literary-management",
    description:
      "A multi-stage campus treasure hunt testing observation, logic, and speed.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 9:00 AM",
    venue: "Campus-wide",
    teamSize: "2–4 members",
    prizes: "Cash prizes + Hampers",
    rules:
      "Teams of 2–4. Multi-stage clues across campus. First to solve all wins. No phones during clue-solving stages.",
  },
  {
    id: "lit-2",
    name: "Bid To Win — IPL Auction",
    category: "literary-management",
    description:
      "A simulated IPL auction where teams compete to build the strongest squad under budget.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 10:00 AM",
    venue: "Seminar Hall",
    teamSize: "3–5 members",
    prizes: "Cash prizes + Trophies",
    rules:
      "Teams bid on fictional players with a fixed purse. Strategic bidding, player stats provided. Winning team judged on squad balance.",
  },
  {
    id: "lit-3",
    name: "Meme Battle — The Marketing War",
    category: "literary-management",
    description:
      "A marketing competition where strategy and humor combine to drive audience engagement.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 1:00 PM",
    venue: "Digital Lab",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Social media feature",
    rules:
      "Create 3 original memes on a given brand/topic within 45 minutes. Judged on creativity, relevance, and engagement potential.",
  },
  {
    id: "lit-4",
    name: "Battle of Brands",
    category: "literary-management",
    description:
      "Teams pitch and defend brand strategies in a competitive marketing showcase.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 1:00 PM",
    venue: "Seminar Hall",
    teamSize: "3–5 members",
    prizes: "Cash prizes + Internship opportunities",
    rules:
      "Teams present a brand strategy for a fictional product. 15-minute pitch + 10-minute Q&A. Judged on strategy, presentation, and defend.",
  },
  {
    id: "lit-5",
    name: "Idea Verse",
    category: "literary-management",
    description:
      "An innovation pitch competition where participants present original ideas to a panel.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 11:00 AM",
    venue: "Seminar Hall",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Incubation support",
    rules:
      "5-minute pitch + 5-minute Q&A. Ideas must address a real problem. Slides permitted but not required.",
  },
  {
    id: "lit-6",
    name: "The Great Debate",
    category: "literary-management",
    description:
      "A formal debate competition for participants who can argue with precision and conviction.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 3:00 PM",
    venue: "Auditorium",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Trophy",
    rules:
      "British Parliamentary format. Topics released 24 hours before. Individual and team categories. Time limit: 7 minutes per speaker.",
  },
  {
    id: "lit-7",
    name: "Vocal Ink — Slam Poetry",
    category: "literary-management",
    description:
      "A spoken-word competition where original poetry is performed live for a judging panel.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 4:00 PM",
    venue: "Auditorium",
    teamSize: "Individual",
    prizes: "Cash prizes + Publication opportunity",
    rules:
      "Original work only. 3 minutes per performance. No props or costumes. Judged on delivery, originality, and emotional impact.",
  },

  // Science & Technology
  {
    id: "sci-1",
    name: "IdeaSpark — Single",
    category: "science-tech",
    description:
      "A solo innovation pitch competition for individuals with a prototype or concept.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 10:00 AM",
    venue: "Innovation Hub",
    teamSize: "Individual",
    prizes: "Cash prizes + Incubation support",
    rules:
      "Solo presenters only. 7-minute pitch + 5-minute Q&A. Prototype or detailed concept required. Slides permitted.",
  },
  {
    id: "sci-2",
    name: "IdeaSpark — Group",
    category: "science-tech",
    description:
      "A team-based innovation pitch competition for collaborative projects.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 2:00 PM",
    venue: "Innovation Hub",
    teamSize: "2–5 members",
    prizes: "Cash prizes + Incubation support",
    rules:
      "Teams of 2–5. 10-minute pitch + 5-minute Q&A. Prototype or detailed concept required.",
  },
  {
    id: "sci-3",
    name: "Sci-Pha-Agro — Model/Product",
    category: "science-tech",
    description:
      "A hands-on model and product-making competition across science, pharma, and agriculture.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 10:00 AM",
    venue: "Exhibition Hall",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Certificates",
    rules:
      "Bring a working model or product prototype. 5-minute demonstration + 5-minute Q&A. Open to science, pharma, and agriculture domains.",
  },
  {
    id: "sci-4",
    name: "Sci-Pha-Agro — Oral/Poster",
    category: "science-tech",
    description:
      "An oral and poster presentation competition for research across science domains.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 2:00 PM",
    venue: "Exhibition Hall",
    teamSize: "Individual or Pair",
    prizes: "Cash prizes + Publication opportunity",
    rules:
      "Poster size: A0. Oral presentation: 10 minutes + 5-minute Q&A. Research must be original work.",
  },
  {
    id: "sci-5",
    name: "AI — Prompt Challenge",
    category: "science-tech",
    description:
      "A competition testing the ability to craft effective prompts for artificial intelligence systems.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 3:00 PM",
    venue: "Digital Lab",
    teamSize: "Individual",
    prizes: "Cash prizes + Tech vouchers",
    rules:
      "Three rounds of increasing difficulty. Participants must achieve specified outputs using AI tools. Time limit per round: 20 minutes.",
  },

  // Sports
  {
    id: "sport-1",
    name: "Cricket",
    category: "sports",
    description: "A tournament-format cricket competition open to all skill levels.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1–2, 8:00 AM",
    venue: "Cricket Ground",
    teamSize: "11 members",
    prizes: "Trophy + Medals",
    rules:
      "T20 format. Teams of 11. Round-robin followed by knockout. Full cricket rules apply. Bring your own kits.",
  },
  {
    id: "sport-2",
    name: "Football",
    category: "sports",
    description:
      "A football tournament bringing together the best players on campus.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1–2, 8:00 AM",
    venue: "Football Ground",
    teamSize: "7 members",
    prizes: "Trophy + Medals",
    rules:
      "7-a-side format. Round-robin followed by knockout. 20-minute halves. Standard football rules.",
  },
  {
    id: "sport-3",
    name: "Basketball",
    category: "sports",
    description:
      "A basketball competition for teams ready to compete on the hardwood.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 9:00 AM",
    venue: "Basketball Court",
    teamSize: "5 members",
    prizes: "Trophy + Medals",
    rules:
      "5-a-side. Round-robin followed by knockout. 10-minute halves. Standard basketball rules.",
  },
  {
    id: "sport-4",
    name: "Kabaddi",
    category: "sports",
    description:
      "A high-energy kabaddi tournament for teams and individuals.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 9:00 AM",
    venue: "Kabaddi Ground",
    teamSize: "7 members",
    prizes: "Trophy + Medals",
    rules:
      "7-a-side. Standard kabaddi rules. Round-robin followed by knockout. 20-minute halves.",
  },
  {
    id: "sport-5",
    name: "Carrom",
    category: "sports",
    description:
      "A carrom tournament testing precision, strategy, and composure.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 10:00 AM",
    venue: "Indoor Sports Hall",
    teamSize: "Individual or Pair",
    prizes: "Trophy + Medals",
    rules:
      "Singles and doubles categories. Pool stage followed by knockout. Standard carrom rules.",
  },
  {
    id: "sport-6",
    name: "Chess",
    category: "sports",
    description:
      "A chess competition for players who think several moves ahead.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 10:00 AM",
    venue: "Indoor Sports Hall",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Swiss system. 15 minutes per player per game. Standard FIDE rules apply.",
  },
  {
    id: "sport-7",
    name: "Volleyball",
    category: "sports",
    description:
      "A volleyball tournament for teams competing at the net.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 10:00 AM",
    venue: "Volleyball Court",
    teamSize: "6 members",
    prizes: "Trophy + Medals",
    rules:
      "6-a-side. Best of 3 sets. Round-robin followed by knockout. Standard volleyball rules.",
  },
  {
    id: "sport-8",
    name: "Table Tennis",
    category: "sports",
    description:
      "A table tennis competition for players with quick reflexes and sharp technique.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 11:00 AM",
    venue: "Indoor Sports Hall",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Singles only. Pool stage followed by knockout. Best of 5 games. Standard ITTF rules.",
  },
  {
    id: "sport-9",
    name: "Badminton — Singles Men",
    category: "sports",
    description: "A men's singles badminton tournament on the court.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 11:00 AM",
    venue: "Badminton Court",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Singles format. Pool stage followed by knockout. Best of 3 games. Standard BWF rules.",
  },
  {
    id: "sport-10",
    name: "Badminton — Doubles Men",
    category: "sports",
    description: "A men's doubles badminton tournament for team pairs.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 11:00 AM",
    venue: "Badminton Court",
    teamSize: "Pair",
    prizes: "Trophy + Medals",
    rules:
      "Doubles format. Pool stage followed by knockout. Best of 3 games. Standard BWF rules.",
  },
  {
    id: "sport-11",
    name: "Badminton — Singles Women",
    category: "sports",
    description: "A women's singles badminton tournament.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 11:00 AM",
    venue: "Badminton Court",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Singles format. Pool stage followed by knockout. Best of 3 games. Standard BWF rules.",
  },
  {
    id: "sport-12",
    name: "Badminton — Doubles Women",
    category: "sports",
    description: "A women's doubles badminton tournament for team pairs.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 11:00 AM",
    venue: "Badminton Court",
    teamSize: "Pair",
    prizes: "Trophy + Medals",
    rules:
      "Doubles format. Pool stage followed by knockout. Best of 3 games. Standard BWF rules.",
  },
  {
    id: "sport-13",
    name: "Power Lifting",
    category: "sports",
    description:
      "A power lifting competition for athletes who train with purpose.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 8:00 AM",
    venue: "Gymnasium",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Squat, bench press, deadlift. Three attempts per lift. IPF rules apply. Weight categories enforced.",
  },
  {
    id: "sport-14",
    name: "Weight Lifting",
    category: "sports",
    description:
      "A weight lifting competition testing strength and technique.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 8:00 AM",
    venue: "Gymnasium",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Snatch and clean & jerk. Three attempts per lift. IWF rules apply. Weight categories enforced.",
  },
  {
    id: "sport-15",
    name: "Arm Wrestling",
    category: "sports",
    description:
      "A one-on-one arm wrestling competition for the strongest on campus.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 1, 1:00 PM",
    venue: "Indoor Sports Hall",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Left hand and right hand categories. Single elimination. Best of 3 per match.",
  },
  {
    id: "sport-16",
    name: "Snooker",
    category: "sports",
    description:
      "A snooker tournament for players who value precision and patience.",
    poster: null,
    registrationStatus: "coming-soon",
    time: "Day 2, 1:00 PM",
    venue: "Indoor Sports Hall",
    teamSize: "Individual",
    prizes: "Trophy + Medals",
    rules:
      "Single elimination. Frames format. Standard WPBSA rules. Bring your own cue or use venue equipment.",
  },
];
