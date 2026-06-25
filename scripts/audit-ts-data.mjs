import { readFileSync } from "node:fs";
import { join } from "node:path";

const catalogs = [
  { name: "events", file: "src/app/data/events/index.ts", exportName: "EVENTS", min: 8 },
  { name: "jobs", file: "src/app/data/jobs/index.ts", exportName: "JOBS", min: 8 },
  { name: "locations", file: "src/app/data/locations/index.ts", exportName: "LOCATIONS", min: 8 },
  { name: "items", file: "src/app/data/items/index.ts", exportName: "ITEMS", min: 10 },
  { name: "diseases", file: "src/app/data/diseases/index.ts", exportName: "DISEASES", min: 8 },
  { name: "legal", file: "src/app/data/legal/index.ts", exportName: "LEGAL_CASES", min: 4 },
  { name: "travel", file: "src/app/data/travel/index.ts", exportName: "TRAVEL_DESTINATIONS", min: 5 },
  { name: "lifeNodes", file: "src/app/data/lifeNodes/index.ts", exportName: "LIFE_NODES", min: 4 },
];

function findArrayStart(source, exportName) {
  const marker = `export const ${exportName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return -1;
  const assignmentIndex = source.indexOf("=", markerIndex);
  if (assignmentIndex < 0) return -1;
  return source.indexOf("[", assignmentIndex);
}

function skipString(source, index, quote) {
  let i = index + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i += 1;
  }
  return source.length;
}

function skipTemplate(source, index) {
  let i = index + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === "`") return i + 1;
    i += 1;
  }
  return source.length;
}

function skipLineComment(source, index) {
  const end = source.indexOf("\n", index + 2);
  return end < 0 ? source.length : end + 1;
}

function skipBlockComment(source, index) {
  const end = source.indexOf("*/", index + 2);
  return end < 0 ? source.length : end + 2;
}

function countArrayExport(source, exportName) {
  const start = findArrayStart(source, exportName);
  if (start < 0) return null;

  let squareDepth = 0;
  let curlyDepth = 0;
  let count = 0;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (ch === '"' || ch === "'") {
      i = skipString(source, i, ch) - 1;
      continue;
    }
    if (ch === "`") {
      i = skipTemplate(source, i) - 1;
      continue;
    }
    if (ch === "/" && next === "/") {
      i = skipLineComment(source, i) - 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      i = skipBlockComment(source, i) - 1;
      continue;
    }

    if (ch === "[") {
      squareDepth += 1;
      continue;
    }
    if (ch === "]") {
      squareDepth -= 1;
      if (squareDepth === 0) return count;
      continue;
    }
    if (ch === "{") {
      if (squareDepth === 1 && curlyDepth === 0) count += 1;
      curlyDepth += 1;
      continue;
    }
    if (ch === "}") {
      curlyDepth = Math.max(0, curlyDepth - 1);
    }
  }

  return null;
}

let failed = 0;
const rows = [];

for (const catalog of catalogs) {
  const fullPath = join(process.cwd(), catalog.file);
  const source = readFileSync(fullPath, "utf8");
  const count = countArrayExport(source, catalog.exportName);

  if (typeof count !== "number") {
    failed += 1;
    rows.push(`✗ ${catalog.name}: missing exported array ${catalog.exportName}`);
    continue;
  }
  if (count < catalog.min) {
    failed += 1;
    rows.push(`✗ ${catalog.name}: ${count}/${catalog.min} records`);
    continue;
  }
  rows.push(`✓ ${catalog.name}: ${count} records`);
}

console.log(rows.join("\n"));

if (failed > 0) {
  console.error(`TS data audit failed: ${failed}/${catalogs.length}`);
  process.exit(1);
}

console.log(`TS data audit passed: ${catalogs.length} catalogs`);
