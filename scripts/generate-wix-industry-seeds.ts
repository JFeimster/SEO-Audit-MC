/**
 * Purpose:
 * Generate import-ready Wix CMS seed CSVs for Phase 1 industry pages.
 *
 * Source of truth input:
 * - data/phase1_rollout_candidates.csv
 *
 * Outputs:
 * - data/wix_industryPages_seed.csv
 * - data/wix_industryFaqs_seed.csv
 * - data/wix_industryModules_seed.csv
 * - data/wix_industryLinks_seed.csv
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type RolloutCandidate = {
  slug: string;
  primary_keyword: string;
  page_family: string;
  search_intent: string;
  funnel_stage: string;
  priority: string;
  schema_type: string;
  parent_page: string;
  cta_type: string;
  status: string;
  notes: string;
};

const root = process.cwd();
const dataDir = path.join(root, "data");
const sourcePath = path.join(dataDir, "phase1_rollout_candidates.csv");

const industryPagesHeaders = [
  "title",
  "slug",
  "status",
  "pageFamily",
  "priority",
  "launchBatch",
  "primaryKeyword",
  "secondaryKeywords",
  "searchIntent",
  "funnelStage",
  "parentPagePath",
  "h1",
  "heroHeadline",
  "heroSubhead",
  "heroImage",
  "heroImageAlt",
  "industryIcon",
  "heroBadge",
  "industryContext",
  "financingNeedsIntro",
  "qualificationIntro",
  "processOverview",
  "disclosureBlock",
  "ctaType",
  "primaryCtaLabel",
  "primaryCtaUrl",
  "secondaryCtaLabel",
  "secondaryCtaUrl",
  "servicePageUrl",
  "trustPageUrl",
  "siblingFallbackUrl",
  "seoTitle",
  "metaDescription",
  "canonicalUrl",
  "robotsDirective",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "schemaTypes",
  "serviceName",
  "serviceCategory",
  "faqSchemaEnabled",
  "metadataApproved",
  "schemaApproved",
  "linksApproved",
  "disclosureApproved",
  "contentApproved",
  "qaPass",
  "publishReady",
  "publishedUrl",
  "lastQaAt",
  "lastQaBy",
  "blockerReason",
  "opsNotes"
];

const industryFaqsHeaders = [
  "industrySlug",
  "industryPageRef",
  "question",
  "answer",
  "sortOrder",
  "isActive",
  "schemaInclude",
  "sourceNote"
];

const industryModulesHeaders = [
  "industrySlug",
  "industryPageRef",
  "moduleType",
  "headline",
  "body",
  "statValue",
  "statLabel",
  "mediaImage",
  "mediaImageAlt",
  "buttonLabel",
  "buttonUrl",
  "badgeText",
  "sortOrder",
  "isActive"
];

const industryLinksHeaders = [
  "industrySlug",
  "industryPageRef",
  "linkType",
  "linkLabel",
  "linkUrl",
  "isRequired",
  "sortOrder",
  "isActive"
];

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function toCsv(rows: string[][]): string {
  return `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

function slugToIndustryLabel(slug: string): string {
  const cleaned = slug
    .replace(/^\/industries\//, "")
    .replace(/-(funding|financing)$/, "")
    .replace(/-/g, " ")
    .trim();

  return cleaned
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeIndustrySlug(slug: string): string {
  return slug.replace(/^\/industries\//, "").trim();
}

function toIndustryPath(slug: string): string {
  return `/industries/${normalizeIndustrySlug(slug)}`;
}

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function priorityToNumber(priority: string): number {
  const normalized = priority.trim().toLowerCase();
  if (normalized === "p1") return 1;
  if (normalized === "p2") return 2;
  if (normalized === "p3") return 3;
  return 9;
}

function launchBatch(priorityNumber: number): string {
  if (priorityNumber === 1) return "batch_01";
  if (priorityNumber === 2) return "batch_02";
  return "batch_03";
}

function getSiblingFallback(currentSlug: string, allSlugs: string[]): string {
  const fallback = allSlugs.find((slug) => slug !== currentSlug);
  return fallback ?? "/industries/wix-seller-financing";
}

function getSiblingInPreferredPool(currentSlug: string, preferredSlugs: string[], allSlugs: string[]): string {
  const pool = preferredSlugs.length > 1 ? preferredSlugs : allSlugs;
  const currentIndex = pool.indexOf(currentSlug);

  if (currentIndex >= 0) {
    const siblingIndex = (currentIndex + 1) % pool.length;
    const siblingSlug = pool[siblingIndex];
    if (siblingSlug && siblingSlug !== currentSlug) {
      return siblingSlug;
    }
  }

  return getSiblingFallback(currentSlug, allSlugs);
}

function buildIndustryPagesRows(candidates: RolloutCandidate[]): string[][] {
  const allSlugPaths = candidates.map((candidate) => toIndustryPath(candidate.slug));
  const slugsByBatch = new Map<string, string[]>();

  for (const candidate of candidates) {
    const batch = launchBatch(priorityToNumber(candidate.priority));
    const current = slugsByBatch.get(batch) ?? [];
    current.push(toIndustryPath(candidate.slug));
    slugsByBatch.set(batch, current);
  }

  return candidates.map((candidate) => {
    const normalizedSlug = normalizeIndustrySlug(candidate.slug);
    const industryPath = toIndustryPath(candidate.slug);
    const batch = launchBatch(priorityToNumber(candidate.priority));
    const batchSlugs = slugsByBatch.get(batch) ?? [];
    const industryLabel = slugToIndustryLabel(normalizedSlug);
    const keywordLabel = titleCase(candidate.primary_keyword);
    const priorityNumber = priorityToNumber(candidate.priority);
    const canonicalUrl = `https://www.distilledfunding.com${industryPath}`;
    const metaDescription = `Explore funding options for ${industryLabel.toLowerCase()} operators with Distilled Funding by Moonshine Capital. Review use cases, requirements, and apply when ready.`;
    const blockerReason = "Seeded from phase1 rollout candidates. Complete media, content, metadata, schema, links, and disclosure QA before publish.";
    const schemaTypes = candidate.schema_type.replaceAll("|", ",");

    return [
      keywordLabel,
      normalizedSlug,
      candidate.status,
      candidate.page_family,
      String(priorityNumber),
      launchBatch(priorityNumber),
      candidate.primary_keyword,
      "",
      candidate.search_intent,
      candidate.funnel_stage,
      candidate.parent_page,
      `Funding for ${industryLabel} Operators`,
      `Flexible Funding for ${industryLabel} Operators`,
      `Support payroll, inventory, and timing gaps with financing options built for ${industryLabel.toLowerCase()} operators.`,
      "",
      `${industryLabel} operations`,
      "",
      "Industry Focus",
      `TODO: Add industry-specific operating context for ${industryLabel.toLowerCase()} operators.`,
      `TODO: Add industry-specific use-of-funds guidance for ${industryLabel.toLowerCase()} operators.`,
      `TODO: Add qualification and documentation expectations for ${industryLabel.toLowerCase()} operators.`,
      "TODO: Add factual process steps and review timeline guidance.",
      "TODO: Insert approved disclosure language for Distilled Funding by Moonshine Capital.",
      candidate.cta_type,
      "Start Your Application",
      "/apply",
      "Talk With Our Team",
      "/contact",
      "/revenuebased",
      "/privacy-policy",
      getSiblingInPreferredPool(industryPath, batchSlugs, allSlugPaths),
      `${keywordLabel} | Distilled Funding by Moonshine Capital`,
      metaDescription,
      canonicalUrl,
      "index,follow",
      `Funding for ${industryLabel} Operators`,
      metaDescription,
      "",
      schemaTypes,
      "Revenue-Based Financing",
      "Business Funding",
      "true",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "false",
      "",
      "",
      "",
      blockerReason,
      candidate.notes
    ];
  });
}

function buildFaqRows(candidates: RolloutCandidate[]): string[][] {
  return candidates.flatMap((candidate) => {
    const industrySlug = normalizeIndustrySlug(candidate.slug);
    const industryLabel = slugToIndustryLabel(candidate.slug);
    const sourceNote = "Seeded placeholder. Replace with reviewed, factual copy before publish.";

    return [
      [
        industrySlug,
        "",
        `How is funding used by ${industryLabel.toLowerCase()} businesses?`,
        `TODO: Add practical use-of-funds examples for ${industryLabel.toLowerCase()} operators.`,
        "1",
        "true",
        "true",
        sourceNote
      ],
      [
        industrySlug,
        "",
        `What does Distilled Funding review for ${industryLabel.toLowerCase()} applicants?`,
        `TODO: Add factual qualification criteria and required documentation details.`,
        "2",
        "true",
        "true",
        sourceNote
      ],
      [
        industrySlug,
        "",
        `How quickly can a ${industryLabel.toLowerCase()} business move from application to funding review?`,
        "TODO: Add timeline language that is accurate and non-promissory.",
        "3",
        "true",
        "true",
        sourceNote
      ],
      [
        industrySlug,
        "",
        `What should ${industryLabel.toLowerCase()} owners prepare before applying?`,
        "TODO: Add checklist-based preparation guidance aligned with actual process.",
        "4",
        "true",
        "true",
        sourceNote
      ]
    ];
  });
}

function buildModuleRows(candidates: RolloutCandidate[]): string[][] {
  return candidates.flatMap((candidate) => {
    const industrySlug = normalizeIndustrySlug(candidate.slug);
    const industryLabel = slugToIndustryLabel(candidate.slug);

    return [
      [
        industrySlug,
        "",
        "use_of_funds_card",
        `Common funding uses in ${industryLabel}`,
        `TODO: Add 3-5 specific ${industryLabel.toLowerCase()} use-of-funds bullets backed by real cases.`,
        "",
        "",
        "",
        "",
        "Start Your Application",
        "/apply",
        "Common Need",
        "1",
        "true"
      ],
      [
        industrySlug,
        "",
        "qualification_card",
        `What ${industryLabel} operators should have ready`,
        "TODO: Add concrete qualification and documentation prep items.",
        "",
        "",
        "",
        "",
        "Talk With Our Team",
        "/contact",
        "Preparation",
        "2",
        "true"
      ],
      [
        industrySlug,
        "",
        "process_card",
        "How the review process works",
        "TODO: Add factual, step-by-step process guidance with no guaranteed outcome claims.",
        "",
        "",
        "",
        "",
        "Start Your Application",
        "/apply",
        "Process",
        "3",
        "true"
      ]
    ];
  });
}

function buildLinkRows(candidates: RolloutCandidate[]): string[][] {
  const slugPaths = candidates.map((candidate) => toIndustryPath(candidate.slug));
  const slugsByBatch = new Map<string, string[]>();

  for (const candidate of candidates) {
    const batch = launchBatch(priorityToNumber(candidate.priority));
    const current = slugsByBatch.get(batch) ?? [];
    current.push(toIndustryPath(candidate.slug));
    slugsByBatch.set(batch, current);
  }

  return candidates.flatMap((candidate) => {
    const currentSlug = normalizeIndustrySlug(candidate.slug);
    const currentSlugPath = toIndustryPath(candidate.slug);
    const batch = launchBatch(priorityToNumber(candidate.priority));
    const batchSlugs = slugsByBatch.get(batch) ?? [];
    const siblingSlug = getSiblingInPreferredPool(currentSlugPath, batchSlugs, slugPaths);
    const siblingLabel = slugToIndustryLabel(siblingSlug);

    return [
      [
        currentSlug,
        "",
        "service_page",
        "Revenue-Based Financing",
        "/revenuebased",
        "true",
        "1",
        "true"
      ],
      [
        currentSlug,
        "",
        "trust_page",
        "Privacy Policy",
        "/privacy-policy",
        "true",
        "2",
        "true"
      ],
      [
        currentSlug,
        "",
        "sibling_industry",
        `Funding for ${siblingLabel} Operators`,
        siblingSlug,
        "true",
        "3",
        "true"
      ]
    ];
  });
}

function parseCandidates(contents: string): RolloutCandidate[] {
  const lines = contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [headerLine, ...rowLines] = lines;
  const headers = parseCsvLine(headerLine);

  return rowLines
    .map((line) => parseCsvLine(line))
    .map((values) => {
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });
      return row as unknown as RolloutCandidate;
    })
    .filter((row) => row.page_family === "industry_pages");
}

async function main() {
  const source = await readFile(sourcePath, "utf8");
  const candidates = parseCandidates(source);

  if (candidates.length === 0) {
    throw new Error("No industry_pages rows found in data/phase1_rollout_candidates.csv");
  }

  const industryPagesCsv = toCsv([
    industryPagesHeaders,
    ...buildIndustryPagesRows(candidates)
  ]);

  const industryFaqsCsv = toCsv([
    industryFaqsHeaders,
    ...buildFaqRows(candidates)
  ]);

  const industryModulesCsv = toCsv([
    industryModulesHeaders,
    ...buildModuleRows(candidates)
  ]);

  const industryLinksCsv = toCsv([
    industryLinksHeaders,
    ...buildLinkRows(candidates)
  ]);

  await writeFile(path.join(dataDir, "wix_industryPages_seed.csv"), industryPagesCsv, "utf8");
  await writeFile(path.join(dataDir, "wix_industryFaqs_seed.csv"), industryFaqsCsv, "utf8");
  await writeFile(path.join(dataDir, "wix_industryModules_seed.csv"), industryModulesCsv, "utf8");
  await writeFile(path.join(dataDir, "wix_industryLinks_seed.csv"), industryLinksCsv, "utf8");

  console.log(`Generated Wix seed files for ${candidates.length} industry pages.`);
}

main().catch((error) => {
  console.error("Failed to generate Wix industry seed files.");
  console.error(error);
  process.exit(1);
});
