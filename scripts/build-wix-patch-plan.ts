/**
 * Purpose:
 * Build a local-only Wix field patch plan skeleton for Wave 1 industry rows.
 *
 * Inputs:
 * - data/phase1_rollout_candidates.csv
 * - optional existing data/wix_field_patch_plan.csv
 *
 * Outputs:
 * - data/wix_field_patch_plan.csv
 * - reports/wix-patch-plan-summary.md
 *
 * Constraints:
 * - does not call Wix APIs
 * - does not invent item IDs
 * - preserves existing approval and item metadata when rerun
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

type PatchTemplate = {
  field_key: string;
  proposed_value: string;
  reason: string;
  notes: string;
};

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");

const ROLLOUT_PATH = path.join(DATA_DIR, "phase1_rollout_candidates.csv");
const EXISTING_PATCH_PLAN_PATH = path.join(DATA_DIR, "wix_field_patch_plan.csv");
const OUTPUT_PATCH_PLAN_PATH = path.join(DATA_DIR, "wix_field_patch_plan.csv");
const OUTPUT_SUMMARY_PATH = path.join(REPORTS_DIR, "wix-patch-plan-summary.md");
const OPTIONAL_SPRINT_QUEUE_PATH = path.join(DATA_DIR, "phase1_sprint_queue.csv");

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
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

function parseCsv(content: string): { headers: string[]; rows: Row[] } {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return { headers: [], rows: [] };

  const lines = normalized.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });

  return { headers, rows };
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, """")}"`;
  }
  return value;
}

function toCsv(headers: string[], rows: Row[]): string {
  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }

  return `${lines.join("\n")}\n`;
}

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugToPath(slug: string): string {
  return slug.startsWith("/") ? slug : `/industries/${slug}`;
}

function normalizeSlug(slug: string): string {
  return slugToPath(slug).replace(/^\/industries\//, "");
}

function slugToIndustryLabel(slug: string): string {
  const normalized = normalizeSlug(slug);
  return normalized
    .replace(/-(funding|financing)$/, "")
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildMetaDescription(primaryKeyword: string): string {
  return `Explore ${primaryKeyword} options with Distilled Funding by Moonshine Capital. Review requirements and start your application when ready.`;
}

function buildHeroSubhead(industryLabel: string): string {
  return `Review funding use cases, qualification expectations, and next steps for ${industryLabel.toLowerCase()} operators.`;
}

function buildPatchTemplates(candidate: Row): PatchTemplate[] {
  const normalizedSlug = normalizeSlug(candidate.slug ?? "");
  const industryLabel = slugToIndustryLabel(candidate.slug ?? "");
  const keywordLabel = titleCase(candidate.primary_keyword ?? "");
  const canonicalUrl = `https://www.distilledfunding.com/industries/${normalizedSlug}`;
  const metaDescription = buildMetaDescription(candidate.primary_keyword ?? "");

  return [
    {
      field_key: "seoTitle",
      proposed_value: `${keywordLabel} | Distilled Funding by Moonshine Capital`,
      reason: "Seed-aligned Wave 1 title candidate for connector discovery and approval.",
      notes: "Compare against connector discovery output before approval."
    },
    {
      field_key: "metaDescription",
      proposed_value: metaDescription,
      reason: "Seed-aligned Wave 1 meta description candidate for connector discovery and approval.",
      notes: "Normalize punctuation only after connector discovery confirms the approved stored format."
    },
    {
      field_key: "canonicalUrl",
      proposed_value: canonicalUrl,
      reason: "Seed-aligned canonical candidate for connector discovery and approval.",
      notes: "Do not approve if canonical intent changes."
    },
    {
      field_key: "ogTitle",
      proposed_value: keywordLabel,
      reason: "Seed-aligned OG title candidate for connector discovery and approval.",
      notes: "Live mismatch may still be caused by route or template binding."
    },
    {
      field_key: "ogDescription",
      proposed_value: metaDescription,
      reason: "Seed-aligned OG description candidate for connector discovery and approval.",
      notes: "Use only after connector discovery confirms field availability."
    },
    {
      field_key: "h1",
      proposed_value: `Funding for ${industryLabel} Operators`,
      reason: "Seed-aligned H1 candidate for connector discovery and approval.",
      notes: "Visible content binding still requires Editor verification even if the field is correct in CMS."
    },
    {
      field_key: "heroHeadline",
      proposed_value: `Flexible Funding for ${industryLabel} Operators`,
      reason: "Seed-aligned hero headline candidate for connector discovery and approval.",
      notes: "Visible content binding still requires Editor verification even if the field is correct in CMS."
    },
    {
      field_key: "heroSubhead",
      proposed_value: buildHeroSubhead(industryLabel),
      reason: "Seed-aligned hero subhead candidate for connector discovery and approval.",
      notes: "Visible content binding still requires Editor verification even if the field is correct in CMS."
    }
  ];
}

function patchIdFromIndex(index: number): string {
  return `WIX-PATCH-${String(index + 1).padStart(3, "0")}`;
}

function mergeExistingRow(generatedRow: Row, existingRow: Row | undefined): Row {
  if (!existingRow) {
    return generatedRow;
  }

  const preserveProposedValue =
    (existingRow.status ?? "").trim() !== "" &&
    (existingRow.status ?? "").trim() !== "draft_pending_discovery";

  return {
    ...generatedRow,
    item_id: existingRow.item_id || generatedRow.item_id,
    current_value: existingRow.current_value || generatedRow.current_value,
    proposed_value: preserveProposedValue
      ? existingRow.proposed_value || generatedRow.proposed_value
      : generatedRow.proposed_value,
    status: existingRow.status || generatedRow.status,
    requires_approval: existingRow.requires_approval || generatedRow.requires_approval,
    notes: existingRow.notes || generatedRow.notes
  };
}

async function readCsvIfPresent(filePath: string): Promise<{ headers: string[]; rows: Row[] }> {
  try {
    const content = await readFile(filePath, "utf8");
    return parseCsv(content);
  } catch {
    return { headers: [], rows: [] };
  }
}

function toSummaryMarkdown(
  generatedAt: string,
  selectedSlugs: string[],
  rowCount: number,
  sprintQueueFound: boolean
): string {
  const lines: string[] = [];

  lines.push("# Wix Patch Plan Summary");
  lines.push("");
  lines.push(`- Generated at: \`${generatedAt}\``);
  lines.push(`- Source file: \`data/phase1_rollout_candidates.csv\``);
  lines.push(`- Output file: \`data/wix_field_patch_plan.csv\``);
  lines.push(`- Wave 1 slugs included: \`${selectedSlugs.length}\``);
  lines.push(`- Patch rows generated or preserved: \`${rowCount}\``);
  lines.push(
    `- Optional sprint queue present: \`${sprintQueueFound ? "yes" : "no"}\``
  );
  lines.push("");
  lines.push("## Wave 1 Slugs");
  lines.push("");

  for (const slug of selectedSlugs) {
    lines.push(`- \`${slug}\``);
  }

  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- This script does not call Wix APIs and does not assign item IDs."
  );
  lines.push(
    "- Existing `item_id`, `current_value`, `status`, and approval fields are preserved when the patch plan is regenerated."
  );
  lines.push(
    "- If `data/phase1_sprint_queue.csv` is missing, Wave 1 is derived from the first five `p1` `industry_pages` rows in `data/phase1_rollout_candidates.csv`."
  );
  lines.push(
    "- Treat all generated rows as discovery candidates until connector evidence confirms collection item IDs and current field values."
  );
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const rolloutCsv = await readFile(ROLLOUT_PATH, "utf8");
  const { rows: rolloutRows } = parseCsv(rolloutCsv);
  const { rows: existingPatchRows } = await readCsvIfPresent(EXISTING_PATCH_PLAN_PATH);
  const existingByCompositeKey = new Map(
    existingPatchRows.map((row) => [
      `${row.collection_id}|${row.slug}|${row.field_key}`,
      row
    ])
  );
  const sprintQueueFound = (await readCsvIfPresent(OPTIONAL_SPRINT_QUEUE_PATH)).rows.length > 0;

  const wave1Candidates = rolloutRows
    .filter((row) => row.page_family === "industry_pages" && row.priority === "p1")
    .slice(0, 5);

  if (wave1Candidates.length === 0) {
    throw new Error("No Wave 1 industry candidates found in data/phase1_rollout_candidates.csv");
  }

  const generatedRows: Row[] = [];
  let patchIndex = 0;

  for (const candidate of wave1Candidates) {
    for (const template of buildPatchTemplates(candidate)) {
      const generatedRow: Row = {
        patch_id: patchIdFromIndex(patchIndex),
        collection_id: "industryPages",
        item_id: "",
        slug: normalizeSlug(candidate.slug ?? ""),
        field_key: template.field_key,
        current_value: "",
        proposed_value: template.proposed_value,
        reason: template.reason,
        status: "draft_pending_discovery",
        requires_approval: "true",
        notes: `No item ID in repo. ${template.notes}`
      };

      generatedRows.push(
        mergeExistingRow(
          generatedRow,
          existingByCompositeKey.get(
            `${generatedRow.collection_id}|${generatedRow.slug}|${generatedRow.field_key}`
          )
        )
      );
      patchIndex += 1;
    }
  }

  const headers = [
    "patch_id",
    "collection_id",
    "item_id",
    "slug",
    "field_key",
    "current_value",
    "proposed_value",
    "reason",
    "status",
    "requires_approval",
    "notes"
  ];

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(OUTPUT_PATCH_PLAN_PATH, toCsv(headers, generatedRows), "utf8");
  await writeFile(
    OUTPUT_SUMMARY_PATH,
    toSummaryMarkdown(
      new Date().toISOString(),
      wave1Candidates.map((candidate) => candidate.slug ?? ""),
      generatedRows.length,
      sprintQueueFound
    ),
    "utf8"
  );

  console.log(`Built Wix patch plan skeleton for ${wave1Candidates.length} Wave 1 slugs.`);
  console.log(`Patch rows: ${generatedRows.length}`);
  console.log(`Patch plan: ${path.relative(ROOT_DIR, OUTPUT_PATCH_PLAN_PATH)}`);
  console.log(`Summary: ${path.relative(ROOT_DIR, OUTPUT_SUMMARY_PATH)}`);
}

main().catch((error) => {
  console.error("Failed to build Wix patch plan.");
  console.error(error);
  process.exit(1);
});
