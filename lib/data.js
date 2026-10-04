// Coach contact — used in emails
export const COACH_WHATSAPP = "https://wa.me/923068096769";
export const COACH_NAME = "Finian";






// ─────────────────────────────────────────
// ONE-OFF SERVICES — displayed at /coaching
// ─────────────────────────────────────────
export const services = [
  {
    slug: "ball-mastery-core",
    name: "Ball Mastery: My 10 Core Skills",
    tagline: "10 essential ball mastery skills, explained and demonstrated.",
    pricePence: 1000, // €10.00
    currency: "eur",
    duration: "Self-paced",
    checkout: "oneoff",
    deliveryType: "digital",
    // ↑ "digital" → user gets a link by email (Drive folder)
    driveLink: "https://drive.google.com/YOUR-FOLDER-LINK",
    description:
      "Ten core ball mastery skills, broken down step by step. Demonstration videos organised in a Google Drive, with folders for positions, drills and progression.",
    includes: [
      "10 essential ball mastery skills",
      "Demonstration videos in a Google Drive",
      "Folders by position and drill type",
      "Clear explanation of each skill",
      "Recommended practice time",
      "Repeatable individual skills",
      "Lifetime digital access",
    ],
    forWho: "Players of any age who want a cleaner, sharper first touch.",
  },
  {
    slug: "match-analysis-1",
    name: "1 Game Match Analysis",
    tagline: "Full match reviewed. Personalised video feedback.",
    pricePence: 5000, // €50.00
    currency: "eur",
    duration: "Per game",
    checkout: "oneoff",
    deliveryType: "async",
    // ↑ "async" → user sends footage, coach replies with video
    whatsapp: "https://wa.me/923068096769",
    contactEmail: "coach@ftelitecoaching.com",
    description:
      "Send a full match. You get a 3–4 minute personalised analysis video with on-screen text, highlighting strengths, weaknesses and clear development points.",
    includes: [
      "Full match reviewed",
      "Strengths and weaknesses highlighted",
      "3–4 minute personalised analysis video",
      "Sent via WhatsApp",
      "On-screen text and visual feedback",
      "Clear development points",
    ],
    forWho: "Players who want a pro-level look at their game.",
  },
  {
    slug: "match-analysis-4",
    name: "4 Game Match Analysis",
    tagline: "Four matches reviewed, plus a combined report.",
    pricePence: 15000, // €150.00
    currency: "eur",
    duration: "4 games",
    checkout: "oneoff",
    deliveryType: "async",
    whatsapp: "https://wa.me/923068096769",
    contactEmail: "coach@ftelitecoaching.com",
    description:
      "Four full matches reviewed individually, then a combined analysis over the four-game period showing what's improving and what needs more work.",
    includes: [
      "4 full matches reviewed",
      "Strengths and weaknesses highlighted per game",
      "4 × 3–4 minute personalised analysis videos",
      "Sent via WhatsApp",
      "On-screen text and visual feedback",
      "Combined 4-game analysis at the end",
      "Recurring strengths and weaknesses",
      "Improvements + ongoing areas to work on",
    ],
    forWho: "Players serious about tracking progress over a month.",
  },
];

// ─────────────────────────────────────────
// MONTHLY PACKAGES — displayed at /programmes
// ─────────────────────────────────────────
export const programmes = [
  {
    slug: "position-ball-mastery",
    name: "Position Specific Ball Mastery",
    tagline: "Monthly technical development, tailored to your position.",
    pricePence: 6000, // €60.00
    currency: "eur",
    interval: "month",
    checkout: "subscription",
    level: "All levels",
    description:
      "A monthly programme of five position-specific ball mastery skills. You get a private library of demonstrations, technical challenges and personalised feedback from the coach every month.",
    outcomes: [
      "5 position-specific skills each month",
      "Private demonstration library",
      "How each skill is developed",
      "Individual technical challenges",
      "Private challenges sent to you",
      "Submit your training attempts",
      "Personalised feedback from the coach",
      "Ongoing technical development",
    ],
    includes: [
      "5 new skills per month",
      "Video library access",
      "Skill-development breakdowns",
      "Individual technical challenges",
      "Private challenges sent directly to you",
      "Submit your training attempts",
      "Personalised feedback from the coach",
    ],
    forWho: "Players who want structured, ongoing technical work.",
  },
  {
    slug: "football-mentorship",
    name: "Football Mentorship",
    tagline: "Guidance off the pitch to build your football future.",
    pricePence: 10000, // €100.00
    currency: "eur",
    interval: "month",
    checkout: "subscription",
    level: "Ambitious players",
    description:
      "One-on-one mentorship covering everything around the game — your football journey, personal brand, career planning and development — not just what happens on the pitch.",
    outcomes: [
      "Review your current football experience",
      "Define career ambitions",
      "Build and polish your LinkedIn profile",
      "Networking guidance",
      "Content strategy",
      "Personal brand development",
      "Opportunities to gain experience",
      "Identify areas that need development",
    ],
    includes: [
      "Monthly 1-to-1 sessions",
      "Career and ambition planning",
      "LinkedIn profile optimisation",
      "Networking strategy and intros",
      "Content and personal brand guidance",
      "Opportunities for experience",
      "Development area reviews",
    ],
    forWho: "Players who want to build a career, not just a game.",
  },
];

// ─────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────
export const testimonials = [
  {
    quote: "My son's first touch is unrecognisable after 6 sessions. He got into his club's A team.",
    author: "Sarah",
    role: "Parent",
    rating: 5,
  },
  {
    quote: "The Ball Mastery programme is no joke. I'm winning races I used to lose.",
    author: "Jay",
    role: "16, winger",
    rating: 5,
  },
  {
    quote: "Match analysis showed me things my coach never mentioned. Game changer.",
    author: "Tom",
    role: "19, midfielder",
    rating: 5,
  },
  {
    quote: "Booked the 4-game analysis. Watching the combined report at the end was eye-opening.",
    author: "Danny",
    role: "17, defender",
    rating: 5,
  },
  {
    quote: "The monthly mentorship gave me a plan. Two months in, I've got a trial at a semi-pro club.",
    author: "Priya",
    role: "20, striker",
    rating: 5,
  },
  {
    quote: "Feedback after every submission is what actually made the difference. Proper coaching.",
    author: "Alex",
    role: "18, midfielder",
    rating: 5,
  },
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
export const formatPrice = (pence, currency = "eur") => {
  const symbol = currency === "eur" ? "€" : currency === "gbp" ? "£" : "$";
  const value = pence / 100;
  return Number.isInteger(value) ? `${symbol}${value}` : `${symbol}${value.toFixed(2)}`;
};

export const getService = (slug) => services.find((s) => s.slug === slug);
export const getProgramme = (slug) => programmes.find((p) => p.slug === slug);

export const getCheckoutItem = (slug) =>
  getService(slug) || getProgramme(slug) || null;