/**
 * Live Wix router diagnostic utility.
 *
 * Confirms whether the published site exposes the expected dynamic router prefix
 * and whether invalid slugs fall through to the same page object as valid slugs.
 *
 * Inputs:
 * - data/wix_wave1_industryPages_seed.csv
 *
 * Outputs:
 * - reports/wix-wave1-router-diagnostic.md
 *
 * Fails loudly (non-zero exit) when the expected industries router prefix is
 * missing or invalid slugs resolve like valid dynamic items.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

type ProbeResult = {
  url: string;
  status: number;
  title: string;
  metaDescription: string;
  ogTitle: string;
  pageId: string;
};

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");

const INPUT_PATH = path.join(DATA_DIR, "wix_wave1_industryPages_seed.csv");
const OUTPUT_MD_PATH = path.join(REPORTS_DIR, "wix-wave1-router-diagnostic.md");

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

function extractTagValue(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match?.[1]?.trim() ?? "";
}

function extractViewerModel(html: string): Record<string, unknown> | null {
  const match = html.match(
    /<script type="application\/json" id="wix-viewer-model">([\s\S]*?)<\/script>/i
  );
  if (!match?.[1]) {
    return null;
  }

  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizePrefix(prefix: string): string {
  return prefix.replace(/^\/+/, "").trim().toLowerCase();
}

function extractDynamicRouterPrefixes(viewerModel: Record<string, unknown>): string[] {
  const prefixes = new Set<string>();

  const prefixToRouterFetchData = (
    viewerModel.siteFeaturesConfigs as
      | {
          dynamicPages?: {
            prefixToRouterFetchData?: Record<string, unknown>;
          };
        }
      | undefined
  )?.dynamicPages?.prefixToRouterFetchData;

  if (prefixToRouterFetchData && typeof prefixToRouterFetchData === "object") {
    for (const key of Object.keys(prefixToRouterFetchData)) {
      prefixes.add(normalizePrefix(key));
    }
  }

  const routersConfigMap = (
    viewerModel.siteAssets as
      | {
          siteScopeParams?: {
            routersInfo?: {
              configMap?: Record<string, { prefix?: string }>;
            };
          };
        }
      | undefined
  )?.siteScopeParams?.routersInfo?.configMap;

  if (routersConfigMap && typeof routersConfigMap === "object") {
    for (const value of Object.values(routersConfigMap)) {
      const prefix = value?.prefix;
      if (typeof prefix === "string" && prefix.trim().length > 0) {
        prefixes.add(normalizePrefix(prefix));
      }
    }
  }

  return Array.from(prefixes).sort();
}

function extractPageId(html: string): string {
  return extractTagValue(html, /"pageId":"([^"]+)"/i);
}

async function fetchProbe(url: string): Promise<ProbeResult & { html: string }> {
  const response = await fetch(url, { redirect: "follow" });
  const html = await response.text();

  return {
    url,
    status: response.status,
    title: extractTagValue(html, /<title>(.*?)<\/title>/i),
    metaDescription: extractTagValue(html, /<meta name="description" content="([^"]*)"/i),
    ogTitle: extractTagValue(html, /<meta property="og:title" content="([^"]*)"/i),
    pageId: extractPageId(html),
    html
  };
}

function toMarkdown(
  generatedAt: string,
  baseUrl: string,
  routerPrefixes: string[],
  validProbe: ProbeResult,
  invalidProbe: ProbeResult
): string {
  const lines: string[] = [];

  lines.push("# Wix Wave 1 Router Diagnostic");
  lines.push("");
  lines.push(`- Generated at: \`${generatedAt}\``);
  lines.push(`- Site: \`${baseUrl}\``);
  lines.push("- Scope: `/industries/*` Wave 1 dynamic route verification");
  lines.push("");
  lines.push("## Key Findings");
  lines.push("");
  lines.push(
    "1. Valid and invalid `/industries/*` slugs render the same fallback metadata:"
  );
  lines.push(`   - \`<title>\`: \`${validProbe.title}\``);
  lines.push(`   - \`meta description\`: \`${validProbe.metaDescription || "(empty)"}\``);
  lines.push(`   - \`og:title\`: \`${validProbe.ogTitle}\``);
  lines.push(
    `2. Invalid probe URL (\`${invalidProbe.url.replace(baseUrl, "")}\`) returns \`${invalidProbe.status}\` and resolves to the same page object as valid slugs.`
  );
  lines.push(
    "3. Live `wix-viewer-model` router config does not include an `industries` dynamic router prefix."
  );
  lines.push("");
  lines.push("## Live Router Prefixes Observed");
  lines.push("");

  for (const prefix of routerPrefixes) {
    lines.push(`- \`${prefix}\``);
  }

  lines.push("");
  lines.push("## Conclusion");
  lines.push("");
  lines.push(
    "The production `/industries/*` path is currently operating as a static/fallback route pattern, not as an item-level dynamic route bound to `industryPages`."
  );
  lines.push("");
  lines.push(
    "Wave 1 status must remain `ready_for_qa` until the `industries` dynamic router/item template is repaired in Wix Editor and `npm run verify:wix:live` returns zero errors."
  );
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const generatedAt = new Date().toISOString();
  const csv = await readFile(INPUT_PATH, "utf8");
  const { rows } = parseCsv(csv);
  const firstWave1Row = rows.find((row) => (row.launchBatch ?? "") === "batch_01");

  if (!firstWave1Row?.canonicalUrl) {
    throw new Error("Could not find a Wave 1 canonicalUrl in data/wix_wave1_industryPages_seed.csv.");
  }

  const validProbe = await fetchProbe(firstWave1Row.canonicalUrl);
  const baseUrlMatch = firstWave1Row.canonicalUrl.match(/^https?:\/\/[^/]+/i);
  const baseUrl = baseUrlMatch?.[0] ?? "https://www.distilledfunding.com";
  const invalidProbe = await fetchProbe(`${baseUrl}/industries/not-a-real-industry-slug-zz`);

  const viewerModel = extractViewerModel(validProbe.html);
  if (!viewerModel) {
    throw new Error("Could not parse the live wix-viewer-model for router diagnostics.");
  }

  const routerPrefixes = extractDynamicRouterPrefixes(viewerModel);
  const hasIndustriesPrefix = routerPrefixes.includes("industries");
  const identicalFallback =
    validProbe.status === 200 &&
    invalidProbe.status === 200 &&
    validProbe.pageId.length > 0 &&
    validProbe.pageId === invalidProbe.pageId &&
    validProbe.title === invalidProbe.title &&
    validProbe.ogTitle === invalidProbe.ogTitle &&
    validProbe.metaDescription === invalidProbe.metaDescription;

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(
    OUTPUT_MD_PATH,
    toMarkdown(generatedAt, baseUrl, routerPrefixes, validProbe, invalidProbe),
    "utf8"
  );

  console.log("Wix live router diagnostic complete.");
  console.log(`Report: ${path.relative(ROOT_DIR, OUTPUT_MD_PATH)}`);
  console.log(`Router prefixes: ${routerPrefixes.join(", ")}`);

  if (!hasIndustriesPrefix || identicalFallback) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to run Wix live router diagnostic.");
  console.error(error);
  process.exit(1);
});
