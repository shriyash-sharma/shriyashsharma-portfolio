import type { ApiContentItem, ContentType } from "@/lib/api/contracts/content";

type Metadata = ApiContentItem["metadata"];

export type MetadataFieldSpec = {
  key: string;
  aliases?: string[];
  label: string;
  description: string;
};

export const projectMetadataFieldSpecs: MetadataFieldSpec[] = [
  {
    key: "stack",
    label: "Tech stack",
    description: "Comma-separated stack shown in the tech stack blocks and sidebar.",
  },
  {
    key: "intro",
    label: "Intro",
    description:
      "Short lead paragraph shown under the project title on the detail page. Separate from the list/SEO description.",
  },
  {
    key: "github",
    aliases: ["github_url", "githubUrl"],
    label: "GitHub link",
    description: "Shows in the Project surfaces card as the repository link.",
  },
  {
    key: "live",
    aliases: ["live_url", "liveUrl"],
    label: "Live product link",
    description: "Shows in the Project surfaces card as the live product link.",
  },
  {
    key: "caseStudy",
    aliases: ["case_study", "caseStudyUrl"],
    label: "Related case study link",
    description: "Shows in the Project surfaces card as the related case study link.",
  },
  {
    key: "key_decision",
    aliases: ["keyDecision"],
    label: "Key engineering decision",
    description: "Renders the highlighted decision section on the project detail page.",
  },
  {
    key: "architecture_summary",
    aliases: ["architectureSummary"],
    label: "Architecture summary",
    description: "Renders the Architecture section on the project detail page.",
  },
  {
    key: "system_detail",
    aliases: ["systemDetail"],
    label: "System detail",
    description: "Renders the System details section on the project detail page.",
  },
  {
    key: "card_label",
    aliases: ["cardLabel"],
    label: "Card label",
    description: "Overrides the featured badge label shown at the top of the project page.",
  },
  {
    key: "visual_label",
    aliases: ["visualLabel"],
    label: "System framing label",
    description: "Shows in the sidebar metadata block as the system framing label.",
  },
  {
    key: "home_visual",
    aliases: ["homeVisual"],
    label: "Home visual token",
    description: "Used for home-card visual treatment rather than project-detail body content.",
  },
  {
    key: "featured",
    label: "Featured flag",
    description: "Marks the project as featured for ordering and featured badge treatment.",
  },
  {
    key: "project_status",
    aliases: ["projectStatus", "status_label", "statusLabel"],
    label: "Project status override",
    description: "Overrides status handling, for example open-source vs production.",
  },
  {
    key: "heroImageUrl",
    aliases: ["hero_image_url", "coverImageUrl", "cover_image_url"],
    label: "Hero or cover image",
    description: "Used as the project image reference for metadata and future media surfaces.",
  },
  {
    key: "ogImage",
    aliases: ["og_image", "socialImage", "social_image"],
    label: "Open Graph image",
    description: "Used for SEO and social sharing image metadata.",
  },
  {
    key: "application_category",
    aliases: ["applicationCategory"],
    label: "Application category",
    description: "Used for structured data and SEO metadata.",
  },
  {
    key: "assistant_questions",
    aliases: ["assistantQuestions"],
    label: "AI assistant questions",
    description:
      "Suggested prompts for the Ask AI block on the project page. Enter one question per line.",
  },
];

export const caseStudyMetadataFieldSpecs: MetadataFieldSpec[] = [
  {
    key: "read_time",
    aliases: ["readTime"],
    label: "Estimated read time",
    description: "Shows in the case study header meta row as the reading time.",
  },
  {
    key: "problem",
    aliases: ["challenge", "home_challenge", "homeChallenge"],
    label: "Problem (required)",
    description:
      "Short statement of the problem this case study addresses. Shown on the home page card and the case study header.",
  },
  {
    key: "decision",
    aliases: ["home_decision", "homeDecision"],
    label: "Decision (required)",
    description:
      "Short statement of the key decision or approach taken. Shown on the home page card and the case study header.",
  },
  {
    key: "outcome",
    aliases: ["home_outcome", "homeOutcome"],
    label: "Outcome (required)",
    description:
      "Short statement of the outcome or result. Shown on the home page card and the case study header.",
  },
  {
    key: "operations",
    aliases: ["home_operations", "homeOperations"],
    label: "Operations note",
    description:
      "Optional short ops/runtime note shown next to the outcome on the home page card.",
  },
  {
    key: "intro",
    label: "Intro",
    description:
      "Short lead paragraph shown under the case study title. Separate from the list/SEO description.",
  },
  {
    key: "key_decision",
    aliases: ["keyDecision"],
    label: "Key engineering decision",
    description: "Renders the highlighted decision section on the case study detail page.",
  },
  {
    key: "architecture_summary",
    aliases: ["architectureSummary"],
    label: "Architecture summary",
    description: "Renders the Architecture section on the case study detail page.",
  },
  {
    key: "system_detail",
    aliases: ["systemDetail"],
    label: "System detail",
    description: "Renders the System details section on the case study detail page.",
  },
  {
    key: "assistant_questions",
    aliases: ["assistantQuestions"],
    label: "AI assistant questions",
    description:
      "Suggested prompts for the Ask AI block on the case study page. Enter one question per line.",
  },
];

const metadataFieldSpecsByType: Partial<Record<ContentType, MetadataFieldSpec[]>> = {
  project: projectMetadataFieldSpecs,
  "case-study": caseStudyMetadataFieldSpecs,
};

export function getMetadataFieldSpecs(type: ContentType): MetadataFieldSpec[] {
  return metadataFieldSpecsByType[type] ?? [];
}

function knownMetadataKeysFor(type: ContentType): Set<string> {
  return new Set(
    getMetadataFieldSpecs(type)
      .flatMap((field) => [field.key, ...(field.aliases ?? [])])
      .map((key) => key.trim().toLowerCase())
  );
}

export function isKnownMetadataKey(type: ContentType, key: string): boolean {
  return knownMetadataKeysFor(type).has(key.trim().toLowerCase());
}

export function getAdditionalMetadata(type: ContentType, metadata: Metadata): Array<{
  heading: string;
  description: string;
}> {
  return Object.entries(metadata ?? {})
    .map(([key, value]) => ({
      heading: key.trim(),
      description:
        typeof value === "string"
          ? value.trim()
          : String(value ?? "").trim(),
    }))
    .filter(
      (entry) =>
        entry.heading &&
        entry.description &&
        !isKnownMetadataKey(type, entry.heading)
    );
}

export function getProjectAdditionalMetadata(metadata: Metadata): Array<{
  heading: string;
  description: string;
}> {
  return getAdditionalMetadata("project", metadata);
}

export function readMetadataString(
  metadata: Metadata,
  keys: string[]
): string | null {
  const source = metadata ?? {};
  for (const key of keys) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
}