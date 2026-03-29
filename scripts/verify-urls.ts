/**
 * Phase 0 URL verification utility.
 *
 * Reads URLs from data/five_url_verification.csv when usable rows exist.
 * Falls back to a small hardcoded list when no usable CSV rows are found.
 *
 * Outputs:
 * - reports/url-verification.csv
 * - reports/url-verification.md
 *
 * Fails loudly (non-zero exit) when any URL has:
 * - status code != 200
 * - missing title
 * - missing canonical
 */

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

type VerificationResult = {
  inputUrl: string;
  finalUrl: string;
  statusCode: number;
  title: string;
  metaDescription: string;
  canonical: string;
  robotsMeta: string;
  h1: string;
  textSnippet: string;
  jsonLdCount: number;
  jsonLdTypes: string[];
  criticalFailures: string[];
  error: string;
};

const ROOT_DIR = process.cwd();
const INPUT_CSV_PATH = path.join(ROOT_DIR, "data", "five_url_verification.csv");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");
const OUTPUT_CSV_PATH = path.join(REPORTS_DIR, "url-verification.csv");
const OUTPUT_MD_PATH = path.join(REPORTS_DIR, "url-verification.md");

// Fallback behavior is intentional for bootstrap workflows where CSV rows have not
// been populated yet. Replace these with your real representative URLs as soon as
// data/five_url_verification.csv has usable entries.
const FALLBACK_URLS = ["https://example.com", "https://www.iana.org/domains/reserved"];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

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
  return values.map((value) => value.trim());
}

function parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const normalized = content.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return { headers: [], rows: [] };
  }

  const lines = normalized.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};

    for (let j = 0; j < headers.length; j += 1) {
      row[headers[j]] = values[j] ?? "";
    }

    rows.push(row);
  }

  return { headers, rows };
}

function normalizeUrlCandidate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

async function loadUrls(): Promise<{ urls: string[]; source: "csv" | "fallback" }> {
  if (!(await fileExists(INPUT_CSV_PATH))) {
    return { urls: FALLBACK_URLS, source: "fallback" };
  }

  const csvContent = await readFile(INPUT_CSV_PATH, "utf8");
  const { headers, rows } = parseCsv(csvContent);
  const urlHeader = headers.find((header) => header.toLowerCase() === "url");

  if (!urlHeader) {
    return { urls: FALLBACK_URLS, source: "fallback" };
  }

  const deduped = new Set<string>();
  for (const row of rows) {
    const usable = normalizeUrlCandidate(row[urlHeader] ?? "");
    if (usable) {
      deduped.add(usable);
    }
  }

  const urls = Array.from(deduped);
  if (urls.length === 0) {
    return { urls: FALLBACK_URLS, source: "fallback" };
  }

  return { urls, source: "csv" };
}

function decodeHtmlEntities(input: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " "
  };

  return input
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, num) => String.fromCodePoint(parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? match);
}

function extractFirstMatch(html: string, regex: RegExp): string {
  const match = html.match(regex);
  if (!match || !match[1]) {
    return "";
  }

  return decodeHtmlEntities(match[1].replace(/\s+/g, " ").trim());
}

function extractAttribute(tag: string, attributeName: string): string {
  const escaped = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const attrRegex = new RegExp(
    `\\b${escaped}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`,
    "i"
  );
  const match = tag.match(attrRegex);
  if (!match) {
    return "";
  }

  return decodeHtmlEntities((match[2] ?? match[3] ?? match[4] ?? "").trim());
}

function extractMetaByName(html: string, name: string): string {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    const tagName = extractAttribute(tag, "name").toLowerCase();
    if (tagName === name.toLowerCase()) {
      return extractAttribute(tag, "content");
    }
  }

  return "";
}

function extractCanonical(html: string): string {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of linkTags) {
    const rel = extractAttribute(tag, "rel").toLowerCase();
    if (rel.split(/\s+/).includes("canonical")) {
      return extractAttribute(tag, "href");
    }
  }

  return "";
}

function extractVisibleTextSnippet(html: string, maxLength = 500): string {
  const withoutNoise = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  const visible = decodeHtmlEntities(withoutNoise).replace(/\s+/g, " ").trim();
  return visible.slice(0, maxLength);
}

function collectJsonLdTypes(value: unknown, output: Set<string>) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonLdTypes(item, output);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  const typeValue = record["@type"];
  if (typeof typeValue === "string" && typeValue.trim() !== "") {
    output.add(typeValue.trim());
  } else if (Array.isArray(typeValue)) {
    for (const item of typeValue) {
      if (typeof item === "string" && item.trim() !== "") {
        output.add(item.trim());
      }
    }
  }

  for (const nestedValue of Object.values(record)) {
    collectJsonLdTypes(nestedValue, output);
  }
}

function extractJsonLdInfo(html: string): { count: number; types: string[] } {
  const regex = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const scripts = Array.from(html.matchAll(regex));
  const types = new Set<string>();

  for (const scriptMatch of scripts) {
    const raw = (scriptMatch[1] ?? "").trim();
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      collectJsonLdTypes(parsed, types);
    } catch {
      // Ignore invalid JSON-LD blocks; count is still recorded from script tags.
    }
  }

  return {
    count: scripts.length,
    types: Array.from(types).sort()
  };
}

async function verifyUrl(inputUrl: string): Promise<VerificationResult> {
  const result: VerificationResult = {
    inputUrl,
    finalUrl: "",
    statusCode: 0,
    title: "",
    metaDescription: "",
    canonical: "",
    robotsMeta: "",
    h1: "",
    textSnippet: "",
    jsonLdCount: 0,
    jsonLdTypes: [],
    criticalFailures: [],
    error: ""
  };

  try {
    const response = await fetch(inputUrl, { redirect: "follow" });
    result.finalUrl = response.url || inputUrl;
    result.statusCode = response.status;

    const html = await response.text();
    result.title = extractFirstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i);
    result.metaDescription = extractMetaByName(html, "description");
    result.canonical = extractCanonical(html);
    result.robotsMeta = extractMetaByName(html, "robots");
    result.h1 = extractFirstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    result.textSnippet = extractVisibleTextSnippet(html, 500);

    const jsonLd = extractJsonLdInfo(html);
    result.jsonLdCount = jsonLd.count;
    result.jsonLdTypes = jsonLd.types;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  if (result.statusCode !== 200) {
    result.criticalFailures.push("status_code_not_200");
  }
  if (!result.title) {
    result.criticalFailures.push("missing_title");
  }
  if (!result.canonical) {
    result.criticalFailures.push("missing_canonical");
  }
  if (result.error) {
    result.criticalFailures.push("request_error");
  }

  return result;
}

function csvEscape(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function buildCsvReport(results: VerificationResult[]): string {
  const headers = [
    "input_url",
    "final_url",
    "status_code",
    "title",
    "meta_description",
    "canonical",
    "robots_meta",
    "first_h1",
    "visible_text_first_500",
    "jsonld_count",
    "jsonld_types",
    "critical_failures",
    "error"
  ];

  const rows = results.map((result) => [
    result.inputUrl,
    result.finalUrl,
    String(result.statusCode),
    result.title,
    result.metaDescription,
    result.canonical,
    result.robotsMeta,
    result.h1,
    result.textSnippet,
    String(result.jsonLdCount),
    result.jsonLdTypes.join("|"),
    result.criticalFailures.join("|"),
    result.error
  ]);

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function buildMarkdownReport(
  results: VerificationResult[],
  source: "csv" | "fallback"
): string {
  const generatedAt = new Date().toISOString();
  const failedCount = results.filter((result) => result.criticalFailures.length > 0).length;
  const passedCount = results.length - failedCount;

  const lines: string[] = [];
  lines.push("# URL Verification Report");
  lines.push("");
  lines.push(`- Generated at: \`${generatedAt}\``);
  lines.push(`- URL source: \`${source}\``);
  lines.push(`- Total URLs: \`${results.length}\``);
  lines.push(`- Passed critical checks: \`${passedCount}\``);
  lines.push(`- Failed critical checks: \`${failedCount}\``);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Input URL | Status | Title | Canonical | Critical Failures |");
  lines.push("| --- | --- | --- | --- | --- |");

  for (const result of results) {
    const title = result.title || "(missing)";
    const canonical = result.canonical || "(missing)";
    const failures = result.criticalFailures.join(", ") || "none";
    lines.push(
      `| ${result.inputUrl} | ${result.statusCode || "(none)"} | ${title} | ${canonical} | ${failures} |`
    );
  }

  lines.push("");
  lines.push("## Details");
  lines.push("");

  for (const result of results) {
    lines.push(`### ${result.inputUrl}`);
    lines.push("");
    lines.push(`- Final URL: \`${result.finalUrl || "(unavailable)"}\``);
    lines.push(`- Status code: \`${result.statusCode || 0}\``);
    lines.push(`- Title: ${result.title || "(missing)"}`);
    lines.push(`- Meta description: ${result.metaDescription || "(missing)"}`);
    lines.push(`- Canonical: ${result.canonical || "(missing)"}`);
    lines.push(`- Robots meta: ${result.robotsMeta || "(missing)"}`);
    lines.push(`- First H1: ${result.h1 || "(missing)"}`);
    lines.push(`- JSON-LD count: \`${result.jsonLdCount}\``);
    lines.push(`- JSON-LD @types: ${result.jsonLdTypes.join(", ") || "(none parsed)"}`);
    lines.push(
      `- Critical failures: ${result.criticalFailures.join(", ") || "(none)"}`
    );
    if (result.error) {
      lines.push(`- Error: \`${result.error}\``);
    }
    lines.push(`- Visible text (first 500 chars): ${result.textSnippet || "(missing)"}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const { urls, source } = await loadUrls();
  console.log(`URL source: ${source}`);
  console.log(`URLs queued: ${urls.length}`);

  const results: VerificationResult[] = [];
  for (const url of urls) {
    console.log(`Verifying: ${url}`);
    const result = await verifyUrl(url);
    results.push(result);
  }

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(OUTPUT_CSV_PATH, buildCsvReport(results), "utf8");
  await writeFile(OUTPUT_MD_PATH, buildMarkdownReport(results, source), "utf8");

  const failed = results.filter((result) => result.criticalFailures.length > 0);
  if (failed.length > 0) {
    console.error(`Verification failed for ${failed.length} URL(s).`);
    console.error(`See reports: ${OUTPUT_CSV_PATH} and ${OUTPUT_MD_PATH}`);
    process.exit(1);
  }

  console.log("Verification passed for all URLs.");
  console.log(`Reports written: ${OUTPUT_CSV_PATH} and ${OUTPUT_MD_PATH}`);
}

main().catch((error) => {
  console.error("URL verification failed with an unexpected error.");
  console.error(error);
  process.exit(1);
});
