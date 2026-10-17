import { TrendSignal, VintageAppraisal } from "../types";

export const seedInventory: VintageAppraisal[] = [
  {
    id: "seed-screen-stars",
    title: "Screen Stars Best single-stitch tee",
    category: "Graphic tee",
    brand: "Screen Stars Best",
    era: "late 1980s to early 1990s",
    eraConfidence: "high",
    valueLow: 42,
    valueHigh: 78,
    sellThrough: "Strong if graphic is licensed or tour-related",
    fabricComposition: "50/50 cotton polyester",
    tagFindings: ["Screen Stars Best tag", "Made in USA", "50/50 blend"],
    manufactureSignals: ["Single-stitch sleeve", "Older tubular knit body", "Soft cracked ink"],
    conditionNotes: ["Check pits and collar for yellowing", "Small pinholes are acceptable if graphic is rare"],
    comps: ["Blank Screen Stars tees: $22-$38", "Licensed graphic examples: $55-$120"],
    listingTitle: "Vintage Screen Stars Best Single Stitch Graphic T-Shirt 80s 90s Made USA",
    pricingAdvice: "List at $74 with offers on, accept $50+ if flaws are visible.",
    createdAt: "2026-05-14T14:15:00.000Z",
    images: {}
  },
  {
    id: "seed-giant",
    title: "Giant by Tee Jays band shirt",
    category: "Band tee",
    brand: "Giant by Tee Jays",
    era: "mid 1990s",
    eraConfidence: "medium",
    valueLow: 95,
    valueHigh: 180,
    sellThrough: "High for recognizable artists and tour backs",
    fabricComposition: "100% cotton",
    tagFindings: ["Giant by Tee Jays tag", "Copyright line visible", "Size XL"],
    manufactureSignals: ["Double-sided print", "Boxy 90s fit", "Heavier cotton hand"],
    conditionNotes: ["Fading improves buyer interest", "Avoid dry rot and collar blowout"],
    comps: ["Common artists: $65-$110", "High-demand tour graphics: $150-$300+"],
    listingTitle: "Vintage 90s Giant By Tee Jays Band T-Shirt XL Tour Graphic",
    pricingAdvice: "Start at $179 and validate against exact artist comps before discounting.",
    createdAt: "2026-05-13T18:20:00.000Z",
    images: {}
  }
];

export const trendSignals: TrendSignal[] = [
  {
    id: "single-stitch",
    label: "Single-stitch tees",
    category: "Graphic tees",
    change: 18,
    velocity: "rising",
    note: "Buyer searches keep favoring 80s and 90s blanks with clean tags."
  },
  {
    id: "y2k-mesh",
    label: "Y2K mesh layers",
    category: "Womenswear",
    change: 11,
    velocity: "rising",
    note: "Sheer, mesh, and asymmetrical mall-brand pieces are moving faster."
  },
  {
    id: "carhartt",
    label: "Faded workwear",
    category: "Outerwear",
    change: 7,
    velocity: "steady",
    note: "Sun-faded duck canvas and active jackets still hold value."
  },
  {
    id: "embroidered-denim",
    label: "Embroidered denim",
    category: "Denim",
    change: -4,
    velocity: "cooling",
    note: "Novelty demand is softer unless the brand or motif is exceptional."
  },
  {
    id: "brockum-tour",
    label: "Brockum tour tags",
    category: "Music",
    change: 24,
    velocity: "breakout",
    note: "Tour tees with Brockum tags and clean copyright lines remain scarce."
  }
];
