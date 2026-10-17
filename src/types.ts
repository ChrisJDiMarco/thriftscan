export type AppTab = "scanner" | "inventory" | "trends";

export type Confidence = "low" | "medium" | "high";

export type SelectedPhoto = {
  uri: string;
  base64?: string;
  mimeType?: string;
};

export type VintageAppraisal = {
  id: string;
  title: string;
  category: string;
  brand: string;
  era: string;
  eraConfidence: Confidence;
  valueLow: number;
  valueHigh: number;
  sellThrough: string;
  fabricComposition: string;
  tagFindings: string[];
  manufactureSignals: string[];
  conditionNotes: string[];
  comps: string[];
  listingTitle: string;
  pricingAdvice: string;
  createdAt: string;
  images: {
    garmentUri?: string;
    tagUri?: string;
  };
};

export type TrendSignal = {
  id: string;
  label: string;
  category: string;
  change: number;
  velocity: "cooling" | "steady" | "rising" | "breakout";
  note: string;
};
