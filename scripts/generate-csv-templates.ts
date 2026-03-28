/**
 * Purpose:
 * Rebuild the repo's header-only CSV templates if they are missing.
 *
 * Expected inputs:
 * - none required for the initial scaffold
 *
 * Expected outputs:
 * - data/*.csv files with approved headers only
 *
 * This tiny utility is safe to run repeatedly because it only creates missing files.
 */

import { mkdir, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");

const templates: Record<string, string> = {
  "url_inventory.csv": "url,page_type,status_code,index_state,canonical_target,owner,action,notes\n",
  "redirects.csv": "source_url,target_url,redirect_type,reason,status\n",
  "canonicals.csv": "url,canonical_url,canonical_status,reason,notes\n",
  "keyword_clusters.csv": "cluster_id,topic,intent,primary_keyword,secondary_keywords,target_page_type,priority,notes\n",
  "five_url_verification.csv": "url,page_type,metadata_pass,canonical_pass,schema_pass,trust_pass,crawl_pass,notes\n",
  "action_queue.csv": "task_id,category,priority,asset,owner,status,next_step,notes\n"
};

async function ensureFile(fileName: string, contents: string) {
  const filePath = path.join(dataDir, fileName);

  try {
    await access(filePath, constants.F_OK);
    console.log(`exists: ${fileName}`);
  } catch {
    await writeFile(filePath, contents, "utf8");
    console.log(`created: ${fileName}`);
  }
}

async function main() {
  await mkdir(dataDir, { recursive: true });

  for (const [fileName, headers] of Object.entries(templates)) {
    await ensureFile(fileName, headers);
  }
}

main().catch((error) => {
  console.error("Failed to generate CSV templates.");
  console.error(error);
  process.exit(1);
});
