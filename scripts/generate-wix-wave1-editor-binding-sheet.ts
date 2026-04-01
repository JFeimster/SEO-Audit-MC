/**
 * Generates an operator-ready binding sheet for manual Wix Editor fixes
 * on Wave 1 industry dynamic page SEO bindings.
 *
 * Inputs:
 * - data/wix_wave1_industryPages_seed.csv
 *
 * Outputs:
 * - reports/wix-wave1-editor-binding-sheet.csv
 * - reports/wix-wave1-editor-binding-sheet.md
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");

const INPUT_PATH = path.join(DATA_DIR, "wix_wave1_industryPages_seed.csv");
const OUTPUT_CSV_PATH = path.join(REPORTS_DIR, "wix-wave1-editor-binding-sheet.csv");
const OUTPUT_MD_PATH = path.join(REPORTS_DIR, "wix-wave1-editor-binding-sheet.md");

const EDITOR_URL =
  "https://editor.wix.com/html/editor/web/renderer/edit/397cd6a3-8120-4723-8290-c03a073958ae?metaSiteId=cc61a0cb-edcd-43dc-bdda-42c76443dcd6";

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
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

function toCsv(rows: string[][]): string {
  return `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function toMarkdown(rows: Row[]): string {
  const lines: string[] = [];
  lines.push("# Wix Wave 1 Editor Binding Sheet");
  lines.push("");
  lines.push(`- Generated at: \`${new Date().toISOString()}\``);
  lines.push(`- Target site editor: \`${EDITOR_URL}\``);
  lines.push(`- Wave 1 rows: \`${rows.length}\``);
  lines.push("");
  lines.push("Use this as the source-of-truth while fixing dynamic page/template bindings in Wix Editor.");
  lines.push("");
  lines.push("| Slug | Route | SEO Title | Meta Description | OG Title | H1 | Hero Headline |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");

  for (const row of rows) {
    lines.push(
      `| ${row.slug} | /industries/${row.slug} | ${row.seoTitle.replaceAll("|", "\\|")} | ${row.metaDescription.replaceAll("|", "\\|")} | ${row.ogTitle.replaceAll("|", "\\|")} | ${row.h1.replaceAll("|", "\\|")} | ${row.heroHeadline.replaceAll("|", "\\|")} |`
    );
  }

  lines.push("");
  lines.push("## Required Wix Editor Binding Targets");
  lines.push("");
  lines.push("- Dynamic item route: `/industries/{slug}` from collection `industryPages`.");
  lines.push("- SEO title binding: `seoTitle`.");
  lines.push("- Meta description binding: `metaDescription`.");
  lines.push("- Canonical binding: `canonicalUrl`.");
  lines.push("- OG title binding: `ogTitle`.");
  lines.push("- OG description binding: `ogDescription`.");
  lines.push("- OG image binding: `ogImage`.");
  lines.push("- H1 binding: `h1`.");
  lines.push("- Hero headline binding: `heroHeadline`.");
  lines.push("");
  lines.push("After applying fixes, run: `npm run verify:wix:live`.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const content = await readFile(INPUT_PATH, "utf8");
  const { rows } = parseCsv(content);

  const wave1Rows = rows
    .filter((row) => (row.launchBatch ?? "") === "batch_01")
    .map((row) => ({
      slug: row.slug ?? "",
      seoTitle: row.seoTitle ?? "",
      metaDescription: row.metaDescription ?? "",
      canonicalUrl: row.canonicalUrl ?? "",
      ogTitle: row.ogTitle ?? "",
      ogDescription: row.ogDescription ?? "",
      ogImage: row.ogImage ?? "",
      robotsDirective: row.robotsDirective ?? "",
      h1: row.h1 ?? "",
      heroHeadline: row.heroHeadline ?? ""
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const csvRows: string[][] = [
    [
      "slug",
      "route",
      "seoTitle",
      "metaDescription",
      "canonicalUrl",
      "ogTitle",
      "ogDescription",
      "ogImage",
      "robotsDirective",
      "h1",
      "heroHeadline"
    ],
    ...wave1Rows.map((row) => [
      row.slug,
      `/industries/${row.slug}`,
      row.seoTitle,
      row.metaDescription,
      row.canonicalUrl,
      row.ogTitle,
      row.ogDescription,
      row.ogImage,
      row.robotsDirective,
      row.h1,
      row.heroHeadline
    ])
  ];

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(OUTPUT_CSV_PATH, toCsv(csvRows), "utf8");
  await writeFile(OUTPUT_MD_PATH, toMarkdown(wave1Rows), "utf8");

  console.log(`Generated Wave 1 editor binding sheet for ${wave1Rows.length} rows.`);
  console.log(`Report: ${path.relative(ROOT_DIR, OUTPUT_MD_PATH)}`);
}

main().catch((error) => {
  console.error("Failed to generate Wix Wave 1 editor binding sheet.");
  console.error(error);
  process.exit(1);
});
