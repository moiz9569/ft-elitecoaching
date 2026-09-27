// Placeholder business content — replace with the coach's real offering.
export const CALENDLY_URL = "https://calendly.com/";

export const services = [
  {
    slug: "one-to-one",
    name: "1-to-1 Elite Session",
    tagline: "Personal, position-specific coaching.",
    price: "£60",
    duration: "60 min",
    description:
      "A fully personalised session built around your position, strengths and weaknesses. We film key reps and you leave with clear homework.",
    includes: [
      "Pre-session player assessment",
      "Position-specific drills",
      "Video clips of key reps",
      "Written homework plan",
    ],
    forWho: "Players aged 10+ who want fast, focused improvement.",
    meetLink: "https://meet.google.com/iqn-qhyi-fjf",
  },
  {
    slug: "small-group",
    name: "Small Group Session",
    tagline: "2–4 players. Competitive, game-realistic.",
    price: "£30",
    duration: "75 min",
    description:
      "Train with teammates or friends in a high-intensity small group. Game-realistic scenarios, 1v1 duels and finishing under pressure.",
    includes: [
      "Max 4 players",
      "1v1 and 2v2 scenarios",
      "Finishing under pressure",
      "Individual feedback",
    ],
    forWho: "Friends or teammates who want to push each other.",
    meetLink: "https://meet.google.com/iqn-qhyi-fjf",
  },
  {
    slug: "match-analysis",
    name: "Match Analysis",
    tagline: "Send your footage. Get pro-level feedback.",
    price: "£45",
    duration: "Remote",
    description:
      "Upload a full match or highlights and receive a detailed breakdown of your positioning, decisions and technique, plus a video call to go through it.",
    includes: [
      "Full match breakdown",
      "Annotated clips",
      "30-min review call",
      "3 priority actions",
    ],
    forWho: "Players who want to understand their game like a pro.",
    meetLink: "https://meet.google.com/iqn-qhyi-fjf",
  },
];

const mk = (prefix, weeks) =>
  weeks.map((lessons, wi) => ({
    title: `Week ${wi + 1}`,
    lessons: lessons.map((t, li) => ({
      id: `${prefix}-w${wi + 1}-l${li + 1}`,
      title: t,
      duration: `${8 + ((wi + li) % 5) * 3} min`,
      summary: `Follow along with the video, complete the reps, then log your session. Focus on quality over speed for "${t}".`,
    })),
  }));

export const programmes = [
  {
    slug: "speed-agility",
    name: "Speed & Agility",
    tagline: "Be first to every ball.",
    pricePence: 4900,
    weeks: 6,
    level: "All levels",
    description:
      "A 6-week programme to sharpen acceleration, change of direction and match sharpness. Minimal equipment — cones and a patch of grass.",
    outcomes: [
      "Faster first 5 metres",
      "Sharper change of direction",
      "Better recovery between sprints",
      "Improved footwork",
    ],
    curriculum: mk("sa", [
      [
        "Warm-up & movement prep",
        "Acceleration mechanics",
        "Ladder footwork basics",
      ],
      ["Deceleration control", "Cone agility circuit", "Reactive starts"],
      ["Sprint endurance", "Curved runs", "Ladder progressions"],
      ["Change of direction with ball", "Reaction games", "Recovery session"],
      ["Match-speed circuits", "Explosive plyometrics", "Test week prep"],
      ["Re-test & compare", "Maintenance plan", "Final match-day routine"],
    ]),
  },
  {
    slug: "ball-mastery",
    name: "Ball Mastery",
    tagline: "The ball does what you tell it.",
    pricePence: 3900,
    weeks: 4,
    level: "Beginner – Intermediate",
    description:
      "Daily 20-minute routines to build close control, first touch and confidence on both feet.",
    outcomes: [
      "Cleaner first touch",
      "Confidence on weaker foot",
      "Tighter close control",
      "Skill moves you'll use in games",
    ],
    curriculum: mk("bm", [
      ["Sole rolls & taps", "Inside-outside touches", "Weak foot focus"],
      [
        "First touch off the wall",
        "Receiving on the half-turn",
        "Juggling ladder",
      ],
      ["1v1 moves: scissor & drag", "Moves at speed", "Combination routine"],
      ["Tight-space control", "Pressure receiving", "Final skills test"],
    ]),
  },
  {
    slug: "elite-finisher",
    name: "Elite Finisher",
    tagline: "Composure in front of goal.",
    pricePence: 5900,
    weeks: 6,
    level: "Intermediate – Advanced",
    description:
      "Striker-focused finishing programme covering technique, movement in the box and the mental side of scoring.",
    outcomes: [
      "Cleaner striking technique",
      "Smarter movement in the box",
      "More composure 1v1 with the keeper",
      "Finishing on both feet",
    ],
    curriculum: mk("ef", [
      ["Striking technique", "Placement vs power", "Weak foot finishing"],
      ["Volleys & half-volleys", "Headers", "First-time finishes"],
      ["Movement: near & far post", "Losing your marker", "Cut-backs"],
      ["1v1 vs keeper", "Chips & dinks", "Composure drills"],
      ["Finishing under fatigue", "Game scenarios", "Penalties"],
      ["Mental game", "Finishing test", "Season plan"],
    ]),
  },
];

export const formatPrice = (pence) => `£${(pence / 100).toFixed(0)}`;
export const getProgramme = (slug) => programmes.find((p) => p.slug === slug);
export const getService = (slug) => services.find((s) => s.slug === slug);
export const lessonCount = (p) =>
  p.curriculum.reduce((n, w) => n + w.lessons.length, 0);
