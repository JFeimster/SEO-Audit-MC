/**
 * Phase 1 Wix implementation verification utility.
 *
 * Verifies import artifacts and dynamic-page binding prerequisites for the
 * industry page family without rewriting schema definitions.
 *
 * Inputs:
 * - data/wix_industryPages_seed.csv
 * - data/wix_industryFaqs_seed.csv
 * - data/wix_industryModules_seed.csv
 * - data/wix_industryLinks_seed.csv
 *
 * Outputs:
 * - reports/wix-industry-implementation-verification.csv
 * - reports/wix-industry-implementation-verification.md
 *
 * Fails loudly (non-zero exit) when binding-blocking errors are found.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

type Finding = {
  severity: "error" | "warning";
  check: string;
  collection: string;
  slug: string;
  field: string;
  message: string;
};

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const REPORTS_DIR = path.join(ROOT_DIR, "reports");

const FILES = {
  pages: path.join(DATA_DIR, "wix_industryPages_seed.csv"),
  faqs: path.join(DATA_DIR, "wix_industryFaqs_seed.csv"),
  modules: path.join(DATA_DIR, "wix_industryModules_seed.csv"),
  links: path.join(DATA_DIR, "wix_industryLinks_seed.csv")
};

const OUTPUT_CSV_PATH = path.join(REPORTS_DIR, "wix-industry-implementation-verification.csv");
const OUTPUT_MD_PATH = path.join(REPORTS_DIR, "wix-industry-implementation-verification.md");

const REQUIRED_HEADERS = {
  pages: [
    "slug",
    "status",
    "h1",
    "heroHeadline",
    "heroSubhead",
    "industryContext",
    "financingNeedsIntro",
    "qualificationIntro",
    "processOverview",
    "disclosureBlock",
    "primaryCtaLabel",
    "primaryCtaUrl",
    "secondaryCtaLabel",
    "secondaryCtaUrl",
    "seoTitle",
    "metaDescription",
    "canonicalUrl",
    "robotsDirective",
    "ogTitle",
    "ogDescription",
    "ogImage",
    "schemaTypes",
    "metadataApproved",
    "schemaApproved",
    "linksApproved",
    "disclosureApproved",
    "contentApproved",
    "qaPass",
    "publishReady",
    "blockerReason"
  ],
  faqs: ["industrySlug", "industryPageRef", "question", "answer", "sortOrder", "isActive", "schemaInclude"],
  modules: ["industrySlug", "industryPageRef", "moduleType", "sortOrder", "isActive"],
  links: [
    "industrySlug",
    "industryPageRef",
    "linkType",
    "linkLabel",
    "linkUrl",
    "isRequired",
    "sortOrder",
    "isActive"
  ]
} as const;

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
  if (!normalized) {
    return { headers: [], rows: [] };
  }

  const lines = normalized.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

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

function toBool(value: string): boolean | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}

function formatMarkdownTableRow(cells: string[]): string {
  return `| ${cells.join(" | ")} |`;
}

async function loadCsv(filePath: string): Promise<{ headers: string[]; rows: Row[] }> {
  const content = await readFile(filePath, "utf8");
  return parseCsv(content);
}

function addHeaderFindings(
  findings: Finding[],
  collection: keyof typeof REQUIRED_HEADERS,
  headers: string[]
) {
  const expected = REQUIRED_HEADERS[collection];
  for (const field of expected) {
    if (!headers.includes(field)) {
      findings.push({
        severity: "error",
        check: "required_header_presence",
        collection,
        slug: "",
        field,
        message: `Missing required header "${field}" in ${collection} seed file.`
      });
    }
  }
}

function verifyPagesRows(rows: Row[], findings: Finding[]) {
  const seen = new Set<string>();

  for (const row of rows) {
    const slug = row.slug;
    if (!slug) {
      findings.push({
        severity: "error",
        check: "pages_slug_present",
        collection: "pages",
        slug: "",
        field: "slug",
        message: "industryPages row is missing slug."
      });
      continue;
    }

    if (slug.includes("/")) {
      findings.push({
        severity: "error",
        check: "pages_slug_format",
        collection: "pages",
        slug,
        field: "slug",
        message:
          'industryPages.slug should be a normalized key (for example "restaurant-funding"), not a URL path.'
      });
    }

    if (seen.has(slug)) {
      findings.push({
        severity: "error",
        check: "pages_slug_uniqueness",
        collection: "pages",
        slug,
        field: "slug",
        message: "Duplicate slug found in industryPages."
      });
    }
    seen.add(slug);

    const expectedCanonical = `https://www.distilledfunding.com/industries/${slug}`;
    if ((row.canonicalUrl ?? "") !== expectedCanonical) {
      findings.push({
        severity: "error",
        check: "canonical_slug_alignment",
        collection: "pages",
        slug,
        field: "canonicalUrl",
        message: `Canonical does not match expected route. Expected ${expectedCanonical}.`
      });
    }

    const gateFields = [
      "metadataApproved",
      "schemaApproved",
      "linksApproved",
      "disclosureApproved",
      "contentApproved",
      "qaPass",
      "publishReady"
    ];

    for (const gate of gateFields) {
      const parsed = toBool(row[gate] ?? "");
      if (parsed === null) {
        findings.push({
          severity: "error",
          check: "gate_boolean_valid",
          collection: "pages",
          slug,
          field: gate,
          message: `Expected boolean string "true" or "false" for ${gate}.`
        });
      }
    }

    if ((row.status ?? "") === "planned") {
      for (const gate of gateFields) {
        if (toBool(row[gate] ?? "") !== false) {
          findings.push({
            severity: "warning",
            check: "planned_gate_initialization",
            collection: "pages",
            slug,
            field: gate,
            message: `Planned row usually starts with ${gate}=false for controlled rollout.`
          });
        }
      }

      if (!(row.blockerReason ?? "").trim()) {
        findings.push({
          severity: "warning",
          check: "planned_blocker_reason",
          collection: "pages",
          slug,
          field: "blockerReason",
          message: "Planned row is missing blockerReason context."
        });
      }
    }

    if (toBool(row.publishReady ?? "") === true && toBool(row.qaPass ?? "") !== true) {
      findings.push({
        severity: "error",
        check: "publish_gate_consistency",
        collection: "pages",
        slug,
        field: "publishReady",
        message: "publishReady=true requires qaPass=true."
      });
    }

    if (toBool(row.qaPass ?? "") === true) {
      const approvals = [
        "metadataApproved",
        "schemaApproved",
        "linksApproved",
        "disclosureApproved",
        "contentApproved"
      ];

      for (const approval of approvals) {
        if (toBool(row[approval] ?? "") !== true) {
          findings.push({
            severity: "error",
            check: "qa_pass_approval_consistency",
            collection: "pages",
            slug,
            field: approval,
            message: `qaPass=true requires ${approval}=true.`
          });
        }
      }
    }
  }
}

function verifySupportingRows(
  collection: "faqs" | "modules" | "links",
  rows: Row[],
  pageSlugs: Set<string>,
  findings: Finding[]
) {
  for (const row of rows) {
    const industrySlug = row.industrySlug ?? "";
    const displayedSlug = industrySlug || "(missing)";

    if (!industrySlug) {
      findings.push({
        severity: "error",
        check: "supporting_slug_present",
        collection,
        slug: "",
        field: "industrySlug",
        message: "Supporting row is missing industrySlug."
      });
      continue;
    }

    if (industrySlug.startsWith("/industries/")) {
      findings.push({
        severity: "error",
        check: "supporting_slug_format",
        collection,
        slug: displayedSlug,
        field: "industrySlug",
        message:
          'industrySlug should match industryPages.slug key exactly (for example "restaurant-funding"), not "/industries/..."'
      });
    }

    if (!pageSlugs.has(industrySlug)) {
      findings.push({
        severity: "error",
        check: "supporting_slug_joinability",
        collection,
        slug: displayedSlug,
        field: "industrySlug",
        message: "industrySlug does not match any industryPages.slug, so industryPageRef binding cannot be resolved."
      });
    }
  }
}

function verifyPerPageCoverage(
  pagesRows: Row[],
  faqRows: Row[],
  moduleRows: Row[],
  linkRows: Row[],
  findings: Finding[]
) {
  const pageBySlug = new Map<string, Row>();
  for (const page of pagesRows) {
    const slug = page.slug ?? "";
    if (slug) {
      pageBySlug.set(slug, page);
    }
  }

  const bySlug = {
    faqs: new Map<string, Row[]>(),
    modules: new Map<string, Row[]>(),
    links: new Map<string, Row[]>()
  };

  for (const row of faqRows) {
    const key = row.industrySlug ?? "";
    if (!bySlug.faqs.has(key)) bySlug.faqs.set(key, []);
    bySlug.faqs.get(key)?.push(row);
  }

  for (const row of moduleRows) {
    const key = row.industrySlug ?? "";
    if (!bySlug.modules.has(key)) bySlug.modules.set(key, []);
    bySlug.modules.get(key)?.push(row);
  }

  for (const row of linkRows) {
    const key = row.industrySlug ?? "";
    if (!bySlug.links.has(key)) bySlug.links.set(key, []);
    bySlug.links.get(key)?.push(row);
  }

  const requiredLinkTypes = ["service_page", "trust_page", "sibling_industry"];

  for (const page of pagesRows) {
    const slug = page.slug;

    const faqs = bySlug.faqs.get(slug) ?? [];
    if (faqs.length === 0) {
      findings.push({
        severity: "error",
        check: "faq_presence_per_page",
        collection: "faqs",
        slug,
        field: "industrySlug",
        message: "No FAQ rows found for this page slug."
      });
    }

    const modules = bySlug.modules.get(slug) ?? [];
    if (modules.length === 0) {
      findings.push({
        severity: "error",
        check: "module_presence_per_page",
        collection: "modules",
        slug,
        field: "industrySlug",
        message: "No module rows found for this page slug."
      });
    }

    const links = bySlug.links.get(slug) ?? [];
    if (links.length === 0) {
      findings.push({
        severity: "error",
        check: "link_presence_per_page",
        collection: "links",
        slug,
        field: "industrySlug",
        message: "No link rows found for this page slug."
      });
      continue;
    }

    for (const linkType of requiredLinkTypes) {
      const hasLinkType = links.some((row) => (row.linkType ?? "") === linkType);
      if (!hasLinkType) {
        findings.push({
          severity: "error",
          check: "required_link_type_presence",
          collection: "links",
          slug,
          field: "linkType",
          message: `Missing required ${linkType} link row for this page.`
        });
      }
    }

    const siblingLink = links.find((row) => (row.linkType ?? "") === "sibling_industry");
    if (siblingLink && (page.launchBatch ?? "") === "batch_01") {
      const siblingUrl = siblingLink.linkUrl ?? "";
      const siblingSlug = siblingUrl.replace(/^\/industries\//, "").trim();
      const siblingPage = pageBySlug.get(siblingSlug);

      if (siblingPage && (siblingPage.launchBatch ?? "") !== "batch_01") {
        findings.push({
          severity: "warning",
          check: "wave1_sibling_batch_alignment",
          collection: "links",
          slug,
          field: "linkUrl",
          message:
            "Wave 1 slug links to a sibling outside batch_01. Prefer same-batch sibling links to avoid Wave 2 dependency."
        });
      }
    }
  }
}

function toCsv(findings: Finding[]): string {
  const rows = [
    ["severity", "check", "collection", "slug", "field", "message"],
    ...findings.map((finding) => [
      finding.severity,
      finding.check,
      finding.collection,
      finding.slug,
      finding.field,
      finding.message
    ])
  ];

  return `${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`;
}

function toMarkdown(
  findings: Finding[],
  rowCounts: { pages: number; faqs: number; modules: number; links: number }
): string {
  const generatedAt = new Date().toISOString();
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");
  const topFindings = findings.slice(0, 25);

  const lines: string[] = [];
  lines.push("# Wix Industry Implementation Verification");
  lines.push("");
  lines.push(`- Generated at: \`${generatedAt}\``);
  lines.push(`- Pages rows: \`${rowCounts.pages}\``);
  lines.push(`- FAQ rows: \`${rowCounts.faqs}\``);
  lines.push(`- Module rows: \`${rowCounts.modules}\``);
  lines.push(`- Link rows: \`${rowCounts.links}\``);
  lines.push(`- Errors: \`${errors.length}\``);
  lines.push(`- Warnings: \`${warnings.length}\``);
  lines.push("");
  lines.push("## Scope");
  lines.push("");
  lines.push("- Verifies CMS seed/header coverage for dynamic page bindings.");
  lines.push("- Verifies supporting collection rows can join to `industryPages.slug`.");
  lines.push("- Verifies required per-page supporting rows and link types exist.");
  lines.push("- Verifies publish gate and canonical consistency rules.");
  lines.push("");
  lines.push("## Top Findings");
  lines.push("");

  if (topFindings.length === 0) {
    lines.push("No findings. Implementation artifacts are consistent with binding prerequisites.");
  } else {
    lines.push(formatMarkdownTableRow(["Severity", "Check", "Collection", "Slug", "Field", "Message"]));
    lines.push(formatMarkdownTableRow(["---", "---", "---", "---", "---", "---"]));
    for (const finding of topFindings) {
      lines.push(
        formatMarkdownTableRow([
          finding.severity,
          finding.check,
          finding.collection,
          finding.slug || "(n/a)",
          finding.field || "(n/a)",
          finding.message
        ])
      );
    }
  }

  lines.push("");
  lines.push("## Manual Wix Editor Checks Still Required");
  lines.push("");
  lines.push("- Confirm dynamic page route is `/industries/{slug}` and dataset source is `industryPages`.");
  lines.push("- Confirm repeaters filter by `industryPageRef = current item` and `isActive = true`.");
  lines.push("- Confirm SEO bindings include title, meta description, canonical, OG, and robots directive.");
  lines.push("- Confirm publish workflow blocks records when `publishReady != true`.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const findings: Finding[] = [];

  const pages = await loadCsv(FILES.pages);
  const faqs = await loadCsv(FILES.faqs);
  const modules = await loadCsv(FILES.modules);
  const links = await loadCsv(FILES.links);

  addHeaderFindings(findings, "pages", pages.headers);
  addHeaderFindings(findings, "faqs", faqs.headers);
  addHeaderFindings(findings, "modules", modules.headers);
  addHeaderFindings(findings, "links", links.headers);

  verifyPagesRows(pages.rows, findings);

  const pageSlugs = new Set(pages.rows.map((row) => row.slug).filter((slug) => slug.length > 0));

  verifySupportingRows("faqs", faqs.rows, pageSlugs, findings);
  verifySupportingRows("modules", modules.rows, pageSlugs, findings);
  verifySupportingRows("links", links.rows, pageSlugs, findings);

  verifyPerPageCoverage(pages.rows, faqs.rows, modules.rows, links.rows, findings);

  await mkdir(REPORTS_DIR, { recursive: true });
  await writeFile(OUTPUT_CSV_PATH, toCsv(findings), "utf8");
  await writeFile(
    OUTPUT_MD_PATH,
    toMarkdown(findings, {
      pages: pages.rows.length,
      faqs: faqs.rows.length,
      modules: modules.rows.length,
      links: links.rows.length
    }),
    "utf8"
  );

  const errorCount = findings.filter((finding) => finding.severity === "error").length;
  const warningCount = findings.filter((finding) => finding.severity === "warning").length;

  console.log(
    `Wix industry implementation verification complete. Errors: ${errorCount}. Warnings: ${warningCount}.`
  );
  console.log(`Report: ${path.relative(ROOT_DIR, OUTPUT_MD_PATH)}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to run Wix industry implementation verification.");
  console.error(error);
  process.exit(1);
});
