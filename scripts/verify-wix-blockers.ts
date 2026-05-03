/**
 * Purpose:
 * Read tracked Wix Editor blockers and fail loudly while P0 blockers remain open.
 *
 * Input:
 * - data/wix_editor_blockers.csv
 *
 * Behavior:
 * - prints blocker status summary to stdout
 * - exits non-zero if any P0 blocker is still open or blocked
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

type Row = Record<string, string>;

const ROOT_DIR = process.cwd();
const INPUT_PATH = path.join(ROOT_DIR, "data", "wix_editor_blockers.csv");

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

function isP0(blockerId: string): boolean {
  const normalized = blockerId.toUpperCase().trim();
  return (
    normalized.startsWith("P0-") ||
    normalized === "WIX-BLOCK-001" ||
    normalized === "WIX-BLOCK-002" ||
    normalized === "WIX-BLOCK-003" ||
    normalized === "WIX-BLOCK-004"
  );
}

function isOpenStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return normalized === "open" || normalized === "blocked" || normalized === "needs_review";
}

async function main() {
  const csv = await readFile(INPUT_PATH, "utf8");
  const { rows } = parseCsv(csv);

  if (rows.length === 0) {
    throw new Error("No blocker rows found in data/wix_editor_blockers.csv");
  }

  const openRows = rows.filter((row) => isOpenStatus(row.status ?? ""));
  const openP0Rows = openRows.filter((row) => isP0(row.blocker_id ?? ""));

  console.log("Wix blocker status");
  console.log("------------------");
  console.log(`Total blockers: ${rows.length}`);
  console.log(`Open blockers: ${openRows.length}`);
  console.log(`Open P0 blockers: ${openP0Rows.length}`);
  console.log("");

  for (const row of rows) {
    console.log(
      `[${row.status}] ${row.blocker_id} ${row.scope} :: ${row.blocker}`
    );
    console.log(`  Verify with: ${row.verification_command}`);
  }

  if (openP0Rows.length > 0) {
    console.error("");
    console.error("P0 Wix Editor blockers remain open.");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to verify Wix blockers.");
  console.error(error);
  process.exit(1);
});
