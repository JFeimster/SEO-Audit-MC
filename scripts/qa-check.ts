/**
 * Purpose:
 * Run repo-level QA checks before approving cleanup actions or future page generation.
 *
 * Expected inputs:
 * - data/*.csv source-of-truth files
 * - schemas/*.json starters
 * - docs and templates used for operator workflows
 *
 * Expected outputs:
 * - console warnings for missing required inputs
 * - non-zero exit code when critical governance fields are absent
 */

import { readFileSync, existsSync } from "node:fs";
import * as path from "node:path";

const ROOT_DIR = process.cwd();

let criticalFailures = 0;

function reportFailure(message: string) {
  console.error(`[FAIL] ${message}`);
  criticalFailures++;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
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

function parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return { headers: [], rows: [] };

  const lines = normalized.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);

    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ? values[j].trim() : "";
    }
    rows.push(row);
  }

  return { headers, rows };
}

interface CsvCheckConfig {
  file: string;
  requiredHeaders: string[];
  requiredFields: string[];
}

const csvConfigs: CsvCheckConfig[] = [
  {
    file: "data/action_queue.csv",
    requiredHeaders: ["task_id", "url", "page_type", "issue_type", "severity", "owner", "status", "recommended_action", "notes"],
    requiredFields: ["task_id", "url", "page_type", "issue_type", "severity", "owner", "status", "recommended_action"],
  },
  {
    file: "data/audit_issues.csv",
    requiredHeaders: ["issue_id", "url", "page_type", "issue_type", "severity", "status", "recommended_action", "owner", "notes"],
    requiredFields: ["issue_id", "url", "page_type", "issue_type", "severity", "status", "recommended_action", "owner"],
  },
  {
    file: "data/canonicals.csv",
    requiredHeaders: ["url", "page_type", "target_keyword", "indexability", "canonical_target", "issue_type", "severity", "owner", "status", "recommended_action", "notes"],
    requiredFields: ["url", "page_type", "indexability", "owner", "status", "recommended_action"],
  },
  {
    file: "data/five_url_verification.csv",
    requiredHeaders: ["url", "page_type", "target_keyword", "indexability", "canonical_target", "owner", "status", "recommended_action", "notes"],
    requiredFields: ["url", "page_type", "owner", "status", "recommended_action"],
  },
  {
    file: "data/issue_to_url_map.csv",
    requiredHeaders: ["issue_id", "url", "page_type", "impact_scope", "canonical_url", "index_state", "priority", "status", "owner", "notes"],
    requiredFields: ["issue_id", "url", "page_type", "priority", "status", "owner"],
  },
  {
    file: "data/keyword_clusters.csv",
    requiredHeaders: ["cluster_id", "topic", "intent", "primary_keyword", "secondary_keywords", "target_page_type", "priority", "notes"],
    requiredFields: ["cluster_id", "topic", "intent", "primary_keyword", "target_page_type", "priority"],
  },
  {
    file: "data/phase1_rollout_candidates.csv",
    requiredHeaders: ["slug", "primary_keyword", "page_family", "search_intent", "funnel_stage", "priority", "schema_type", "parent_page", "cta_type", "status", "notes"],
    requiredFields: ["slug", "primary_keyword", "page_family", "search_intent", "funnel_stage", "priority", "schema_type", "parent_page", "cta_type", "status"],
  },
  {
    file: "data/redirects.csv",
    requiredHeaders: ["source_url", "target_url", "issue_type", "severity", "owner", "status", "recommended_action", "notes"],
    requiredFields: ["source_url", "target_url", "owner", "status", "recommended_action"],
  },
  {
    file: "data/schema_backlog.csv",
    requiredHeaders: ["schema_task_id", "url", "page_type", "schema_type", "required_fields_missing", "status", "owner", "priority", "target_release", "notes"],
    requiredFields: ["schema_task_id", "url", "page_type", "schema_type", "status", "owner", "priority"],
  },
  {
    file: "data/url_inventory.csv",
    requiredHeaders: ["url", "page_type", "target_keyword", "indexability", "canonical_target", "issue_type", "severity", "owner", "status", "recommended_action", "notes"],
    requiredFields: ["url", "page_type", "indexability", "owner", "status", "recommended_action"],
  },
  {
    file: "data/wix_changes.csv",
    requiredHeaders: ["change_id", "wix_item_type", "wix_item_id", "url", "change_type", "requested_by", "status", "scheduled_date", "published_date", "rollback_required", "notes"],
    requiredFields: ["change_id", "wix_item_type", "url", "change_type", "requested_by", "status"],
  },
];

function checkCsv(config: CsvCheckConfig) {
  const filePath = path.join(ROOT_DIR, config.file);
  if (!existsSync(filePath)) {
    reportFailure(`File missing: ${config.file}`);
    return;
  }

  const content = readFileSync(filePath, "utf-8");
  const { headers, rows } = parseCsv(content);

  if (headers.join(",") !== config.requiredHeaders.join(",")) {
    reportFailure(
      `Invalid headers in ${config.file}.\nExpected: ${config.requiredHeaders.join(",")}\nFound:    ${headers.join(",")}`
    );
  }

  rows.forEach((row, index) => {
    config.requiredFields.forEach((field) => {
      if (!row[field]) {
        reportFailure(`Missing required field '${field}' in ${config.file} at row ${index + 2}`);
      }
    });

    // Custom validations based on file type
    if (config.file === "data/url_inventory.csv") {
      if (row.indexability !== "blocked" && !row.canonical_target) {
        reportFailure(`Missing canonical_target in ${config.file} at row ${index + 2} (indexability is not blocked)`);
      }
    }

    if (config.file === "data/canonicals.csv") {
      if (row.status !== "blocked" && !row.canonical_target) {
        reportFailure(`Missing canonical_target in ${config.file} at row ${index + 2} (status is not blocked)`);
      }
    }

    if (config.file === "data/five_url_verification.csv") {
      if (!row.canonical_target) {
        reportFailure(`Missing canonical_target in ${config.file} at row ${index + 2}`);
      }
    }

    if (config.file === "data/redirects.csv") {
      if (!row.target_url) {
        reportFailure(`Missing target_url in ${config.file} at row ${index + 2}`);
      }
      if (row.source_url === row.target_url) {
        reportFailure(`source_url equals target_url in ${config.file} at row ${index + 2}`);
      }
    }

    if (config.file === "data/schema_backlog.csv") {
      if (row.status !== "done" && !row.required_fields_missing) {
        reportFailure(`Missing required_fields_missing in ${config.file} at row ${index + 2} (status is not done)`);
      }
    }
  });
}

function checkRobotsMetaPolicy() {
  const filePath = path.join(ROOT_DIR, "docs/robots-meta-policy.md");
  if (!existsSync(filePath)) {
    reportFailure(`File missing: docs/robots-meta-policy.md`);
    return;
  }
  const content = readFileSync(filePath, "utf-8").trim();
  if (!content) {
    reportFailure(`File empty: docs/robots-meta-policy.md`);
  }
}

function runQaChecks() {
  console.log("Running QA checks...");

  csvConfigs.forEach(checkCsv);
  checkRobotsMetaPolicy();

  if (criticalFailures > 0) {
    console.error(`\nQA failed with ${criticalFailures} critical issue(s).`);
    process.exit(1);
  } else {
    console.log("QA passed. All critical checks green.");
  }
}

runQaChecks();
