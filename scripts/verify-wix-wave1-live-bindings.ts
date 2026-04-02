/**
 * Wave 1 live binding verification utility.
 *
 * Compares live public URL metadata against Wave 1 seed expectations.
 * This checks whether dynamic template SEO bindings are actually reflected
 * on live routes before advancing publish lifecycle states.
 *
 * Inputs:
 * - data/wix_wave1_industryPages_seed.csv
 *
 * Outputs:
 * - reports/wix-wave1-live-binding-verification.csv
 * - reports/wix-wave1-live-binding-verification.md
 *
 * Fails loudly (non-zero exit) when binding errors are found.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

type Finding = {
  severity: "error" | "warning";
  slug: string;
  check: string;
  expected: string;
  actual: string;
  message: string;
};

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");

const INPUT_PATH = path.join(DATA_DIR, "wix_wave1_industryPages_seed.csv");
const OUTPUT_CSV_PATH = path.join(REPORTS_DIR, "wix-wave1-live-binding-verification.csv");
const OUTPUT_MD_PATH = path.join(REPORTS_DIR, "wix-wave1-live-binding-verification.md");

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

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

function toCsv(findings: Finding[]): string {
  const rows = [
    ["severity", "slug", "check", "expected", "actual", "message"],
    ...findings.map((finding) => [
      finding.severity,
      finding.slug,
      finding.check,
      finding.expected,
      finding.actual,
      finding.message
    ])
  ];
  return `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function toMarkdown(findings: Finding[], inspectedCount: number): string {
  const generatedAt = new Date().toISOString();
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");

  const lines: string[] = [];
  lines.push("# Wix Wave 1 Live Binding Verification");
  lines.push("");
  lines.push(`- Generated at: \`${generatedAt}\``);
  lines.push(`- Wave 1 URLs inspected: \`${inspectedCount}\``);
  lines.push(`- Errors: \`${errors.length}\``);
  lines.push(`- Warnings: \`${warnings.length}\``);
  lines.push("");
  lines.push("## Findings");
  lines.push("");

  if (findings.length === 0) {
    lines.push("No findings. Live metadata bindings match Wave 1 seed expectations.");
    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  lines.push("| Severity | Slug | Check | Expected | Actual | Message |");
  lines.push("| --- | --- | --- | --- | --- | --- |");

  for (const finding of findings) {
    lines.push(
      `| ${finding.severity} | ${finding.slug} | ${finding.check} | ${finding.expected.replaceAll("|", "\\|")} | ${finding.actual.replaceAll("|", "\\|")} | ${finding.message.replaceAll("|", "\\|")} |`
    );
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

function addMismatchFinding(
  findings: Finding[],
  slug: string,
  check: string,
  expected: string,
  actual: string,
  message: string
) {
  if (expected !== actual) {
    findings.push({
      severity: "error",
      slug,
      check,
      expected,
      actual,
      message
    });
  }
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

async function main() {
  const findings: Finding[] = [];
  const content = await readFile(INPUT_PATH, "utf8");
  const { rows } = parseCsv(content);

  const wave1Rows = rows.filter((row) => (row.launchBatch ?? "") === "batch_01");
  let industriesRouterCheckDone = false;
  const pageIdsBySlug = new Map<string, string>();
  let fallbackProbeUrl = "";

  for (const row of wave1Rows) {
    const slug = row.slug ?? "";
    const url = row.canonicalUrl ?? "";

    if (!slug || !url) {
      findings.push({
        severity: "error",
        slug: slug || "(missing)",
        check: "seed_required_fields",
        expected: "slug + canonicalUrl present",
        actual: `slug="${slug}" canonicalUrl="${url}"`,
        message: "Wave 1 seed row is missing required route metadata."
      });
      continue;
    }

    try {
      const response = await fetch(url, { redirect: "follow" });
      const html = await response.text();

      if (response.status !== 200) {
        findings.push({
          severity: "error",
          slug,
          check: "live_status_code",
          expected: "200",
          actual: String(response.status),
          message: "Live route did not return HTTP 200."
        });
        continue;
      }

      if (!industriesRouterCheckDone) {
        industriesRouterCheckDone = true;
        fallbackProbeUrl = url;

        const viewerModel = extractViewerModel(html);
        if (!viewerModel) {
          findings.push({
            severity: "warning",
            slug,
            check: "viewer_model_parse",
            expected: "wix-viewer-model JSON script parseable",
            actual: "viewer model missing or invalid JSON",
            message:
              "Could not parse live Wix viewer model. Dynamic router prefix checks were skipped for this run."
          });
        } else {
          const prefixes = extractDynamicRouterPrefixes(viewerModel);
          const hasIndustriesPrefix = prefixes.includes("industries");
          if (!hasIndustriesPrefix) {
            findings.push({
              severity: "error",
              slug,
              check: "dynamic_router_prefix_presence",
              expected: "dynamic router prefixes include industries",
              actual: prefixes.join(", "),
              message:
                "Live viewer model does not include an industries dynamic router prefix, so /industries/* may be resolving to a static/fallback page instead of industryPages dynamic routing."
            });
          }
        }
      }

      const actualCanonical = extractTagValue(html, /<link rel="canonical" href="([^"]+)"/i);
      const actualTitle = extractTagValue(html, /<title>(.*?)<\/title>/i);
      const actualMetaDescription = extractTagValue(
        html,
        /<meta name="description" content="([^"]*)"/i
      );
      const actualOgTitle = extractTagValue(html, /<meta property="og:title" content="([^"]*)"/i);
      const actualPageId = extractPageId(html);

      if (actualPageId) {
        pageIdsBySlug.set(slug, actualPageId);
      }

      addMismatchFinding(
        findings,
        slug,
        "canonical_binding",
        row.canonicalUrl ?? "",
        actualCanonical,
        "Canonical tag does not match Wave 1 seed value."
      );

      addMismatchFinding(
        findings,
        slug,
        "seo_title_binding",
        row.seoTitle ?? "",
        actualTitle,
        "Document title does not match Wave 1 seed seoTitle."
      );

      addMismatchFinding(
        findings,
        slug,
        "meta_description_binding",
        row.metaDescription ?? "",
        actualMetaDescription,
        "Meta description does not match Wave 1 seed metaDescription."
      );

      addMismatchFinding(
        findings,
        slug,
        "og_title_binding",
        row.ogTitle ?? "",
        actualOgTitle,
        "OG title does not match Wave 1 seed ogTitle."
      );

      const hasExpectedHero = html.includes(row.heroHeadline ?? "");
      const hasExpectedH1 = html.includes(row.h1 ?? "");
      if (!hasExpectedHero && !hasExpectedH1) {
        findings.push({
          severity: "warning",
          slug,
          check: "content_binding_signal",
          expected: `contains heroHeadline="${row.heroHeadline ?? ""}" or h1="${row.h1 ?? ""}"`,
          actual: "neither string found in HTML response",
          message:
            "Live HTML did not contain expected Wave 1 hero or H1 signal. Dynamic template/data binding may still be unresolved."
        });
      }
    } catch (error) {
      findings.push({
        severity: "error",
        slug,
        check: "live_fetch",
        expected: "successful fetch",
        actual: String(error),
        message: "Failed to fetch live route for binding verification."
      });
    }
  }

  if (fallbackProbeUrl) {
    const invalidProbeUrl = fallbackProbeUrl.replace(
      /\/[^/]+$/,
      "/not-a-real-industry-slug-zz"
    );

    try {
      const probeResponse = await fetch(invalidProbeUrl, { redirect: "follow" });
      const probeHtml = await probeResponse.text();
      const probePageId = extractPageId(probeHtml);

      const distinctWave1PageIds = Array.from(new Set(pageIdsBySlug.values()));
      const hasSingleWave1PageId = distinctWave1PageIds.length === 1;
      const wave1PageId = distinctWave1PageIds[0] ?? "";

      if (
        probeResponse.status === 200 &&
        probePageId &&
        hasSingleWave1PageId &&
        probePageId === wave1PageId
      ) {
        findings.push({
          severity: "warning",
          slug: "not-a-real-industry-slug-zz",
          check: "invalid_slug_fallback_signal",
          expected: "invalid /industries slug should not resolve to same pageId as valid Wave 1 slugs",
          actual: `status=${probeResponse.status}, pageId=${probePageId}`,
          message:
            "Invalid industries slug resolved to the same live pageId as valid slugs, indicating a static/fallback route pattern instead of item-level dynamic routing."
        });
      }
    } catch (error) {
      findings.push({
        severity: "warning",
        slug: "not-a-real-industry-slug-zz",
        check: "invalid_slug_probe_fetch",
        expected: "successful fetch",
        actual: String(error),
        message: "Failed to run invalid slug fallback probe."
      });
    }
  }

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(OUTPUT_CSV_PATH, toCsv(findings), "utf8");
  await writeFile(OUTPUT_MD_PATH, toMarkdown(findings, wave1Rows.length), "utf8");

  const errorCount = findings.filter((finding) => finding.severity === "error").length;
  const warningCount = findings.filter((finding) => finding.severity === "warning").length;

  console.log(
    `Wix Wave 1 live binding verification complete. Errors: ${errorCount}. Warnings: ${warningCount}.`
  );
  console.log(`Report: ${path.relative(ROOT_DIR, OUTPUT_MD_PATH)}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to run Wix Wave 1 live binding verification.");
  console.error(error);
  process.exit(1);
});
