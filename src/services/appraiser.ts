import { SelectedPhoto, VintageAppraisal } from "../types";

type AppraiserInput = {
  garment?: SelectedPhoto;
  tag?: SelectedPhoto;
};

type AppraisalDraft = Omit<VintageAppraisal, "id" | "createdAt" | "images">;

const OPENAI_URL = "https://api.openai.com/v1/responses";
const MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL || "gpt-5.1";

export const expertAppraiserPrompt = [
  "You are ThriftScan's Expert Vintage Appraiser.",
  "Analyze garment and neck tag images for resale research.",
  "Look for visible tag styles, copyright dates, RN numbers, union labels, Screen Stars, Brockum, Giant, Hanes, Fruit of the Loom, fabric composition, made-in-USA marks, single-stitch construction, print age, and condition signals.",
  "Estimate era and resale value conservatively for Depop, Poshmark, and eBay sellers.",
  "Do not claim certainty when the photo is unclear. Flag uncertainty and list the visual evidence that supports the estimate.",
  "Never authenticate luxury goods from image data alone."
].join(" ");

const appraisalSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "category",
    "brand",
    "era",
    "eraConfidence",
    "valueLow",
    "valueHigh",
    "sellThrough",
    "fabricComposition",
    "tagFindings",
    "manufactureSignals",
    "conditionNotes",
    "comps",
    "listingTitle",
    "pricingAdvice"
  ],
  properties: {
    title: { type: "string" },
    category: { type: "string" },
    brand: { type: "string" },
    era: { type: "string" },
    eraConfidence: { type: "string", enum: ["low", "medium", "high"] },
    valueLow: { type: "number" },
    valueHigh: { type: "number" },
    sellThrough: { type: "string" },
    fabricComposition: { type: "string" },
    tagFindings: { type: "array", items: { type: "string" } },
    manufactureSignals: { type: "array", items: { type: "string" } },
    conditionNotes: { type: "array", items: { type: "string" } },
    comps: { type: "array", items: { type: "string" } },
    listingTitle: { type: "string" },
    pricingAdvice: { type: "string" }
  }
};

export async function analyzeVintagePiece(input: AppraiserInput): Promise<VintageAppraisal> {
  const aiEndpoint = process.env.EXPO_PUBLIC_AI_ENDPOINT;
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (aiEndpoint) {
    return analyzeWithProxy(aiEndpoint, input);
  }

  if (!apiKey || (!input.garment?.base64 && !input.tag?.base64)) {
    return createMockAppraisal(input);
  }

  const content = [
    {
      type: "input_text",
      text: "Analyze these resale photos and return the structured appraisal."
    },
    ...buildImageInputs(input)
  ];

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: expertAppraiserPrompt }]
        },
        {
          role: "user",
          content
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "thrift_scan_appraisal",
          strict: true,
          schema: appraisalSchema
        }
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Vision appraisal failed: ${message}`);
  }

  const payload = await response.json();
  return finalizeAppraisal(parseAppraisalPayload(payload), input);
}

async function analyzeWithProxy(endpoint: string, input: AppraiserInput): Promise<VintageAppraisal> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      garment: input.garment,
      tag: input.tag,
      prompt: expertAppraiserPrompt,
      schema: appraisalSchema
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Proxy appraisal failed: ${message}`);
  }

  const payload = await response.json();
  return finalizeAppraisal(payload, input);
}

function buildImageInputs(input: AppraiserInput) {
  const images = [input.garment, input.tag].filter((photo): photo is SelectedPhoto => Boolean(photo?.base64));

  return images.map((photo) => ({
    type: "input_image",
    image_url: toDataUrl(photo)
  }));
}

function toDataUrl(photo: SelectedPhoto): string {
  if (photo.uri.startsWith("data:")) {
    return photo.uri;
  }

  const mimeType = photo.mimeType || "image/jpeg";
  return `data:${mimeType};base64,${photo.base64}`;
}

function parseAppraisalPayload(payload: unknown): AppraisalDraft {
  if (isAppraisalDraft(payload)) {
    return payload;
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new Error("Vision response did not include appraisal text.");
  }

  const parsed: unknown = JSON.parse(outputText);
  if (!isAppraisalDraft(parsed)) {
    throw new Error("Vision response did not match the appraisal schema.");
  }

  return parsed;
}

function extractOutputText(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const direct = payload as { output_text?: unknown; output?: unknown };
  if (typeof direct.output_text === "string") {
    return direct.output_text;
  }

  if (!Array.isArray(direct.output)) {
    return undefined;
  }

  for (const item of direct.output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const message = item as { content?: unknown };
    if (!Array.isArray(message.content)) {
      continue;
    }

    for (const content of message.content) {
      if (!content || typeof content !== "object") {
        continue;
      }

      const part = content as { type?: unknown; text?: unknown };
      if ((part.type === "output_text" || part.type === "text") && typeof part.text === "string") {
        return part.text;
      }
    }
  }

  return undefined;
}

function isAppraisalDraft(value: unknown): value is AppraisalDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<AppraisalDraft>;
  return (
    typeof draft.title === "string" &&
    typeof draft.category === "string" &&
    typeof draft.brand === "string" &&
    typeof draft.era === "string" &&
    (draft.eraConfidence === "low" || draft.eraConfidence === "medium" || draft.eraConfidence === "high") &&
    typeof draft.valueLow === "number" &&
    typeof draft.valueHigh === "number" &&
    typeof draft.sellThrough === "string" &&
    typeof draft.fabricComposition === "string" &&
    Array.isArray(draft.tagFindings) &&
    Array.isArray(draft.manufactureSignals) &&
    Array.isArray(draft.conditionNotes) &&
    Array.isArray(draft.comps) &&
    typeof draft.listingTitle === "string" &&
    typeof draft.pricingAdvice === "string"
  );
}

function finalizeAppraisal(draft: AppraisalDraft, input: AppraiserInput): VintageAppraisal {
  const low = Math.max(0, Math.round(draft.valueLow));
  const high = Math.max(low, Math.round(draft.valueHigh));

  return {
    ...draft,
    valueLow: low,
    valueHigh: high,
    id: `scan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    images: {
      garmentUri: input.garment?.uri,
      tagUri: input.tag?.uri
    }
  };
}

export function createMockAppraisal(input: AppraiserInput = {}): VintageAppraisal {
  return finalizeAppraisal(
    {
      title: "Fruit of the Loom single-stitch graphic tee",
      category: "Graphic tee",
      brand: "Fruit of the Loom",
      era: "late 1980s to early 1990s",
      eraConfidence: "medium",
      valueLow: 38,
      valueHigh: 86,
      sellThrough: "Good if the print is licensed, location-specific, or music-adjacent",
      fabricComposition: "Likely 50/50 cotton polyester based on tag style",
      tagFindings: ["Older Fruit of the Loom mark", "Size and fabric line likely from tag", "No modern QR or long care label visible"],
      manufactureSignals: ["Single-stitch hem cue", "Soft drape", "Light print cracking"],
      conditionNotes: ["Inspect collar ribbing", "Check underarms in daylight", "Photograph flaws before listing"],
      comps: ["Plain vintage Fruit tags: $18-$32", "Strong graphic single-stitch tees: $45-$95", "Rare local/music graphics can clear $120+"],
      listingTitle: "Vintage Fruit of the Loom Single Stitch Graphic T-Shirt 80s 90s",
      pricingAdvice: "List around $79 with offers on. Take $50+ quickly unless the graphic has exact-match high comps."
    },
    input
  );
}
