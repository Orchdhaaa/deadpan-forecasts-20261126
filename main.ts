import { writeFileSync, mkdirSync } from "node:fs";

// Deadpan forecast for make.fun's "Deadpan Forecasts for Cities That
// Do Not Exist": a straight-faced broadcast line for Nulverton, a city
// that does not exist, where the rain itself is undelivered mail.
const FORECAST =
  "In Nulverton, light rain of unsent letters falls until noon, clearing to 21 degrees and a 40 percent chance the postman finally answers.";

// The gate only accepts UTF-8 text of 1 to 160 characters that is not
// whitespace-only, so verify the forecast meets the gate before writing it.
const chars = [...FORECAST].length;
if (chars < 1 || chars > 160 || FORECAST.trim().length === 0) {
  throw new Error(`forecast is ${chars} characters, outside the 1-160 gate`);
}

// The brief demands one line: a second sentence or a line break would
// read as two forecasts, so require exactly one sentence terminator,
// a single trailing period, and no newline.
const terminators = FORECAST.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !FORECAST.endsWith(".") || FORECAST.includes("\n")) {
  throw new Error("forecast must be exactly one sentence on one line");
}

// An em dash or en dash would break the plain broadcast register the
// judge weighs, so refuse either.
if (FORECAST.includes("\u2014") || FORECAST.includes("\u2013")) {
  throw new Error("forecast must not contain a dash");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, FORECAST, "utf8");
