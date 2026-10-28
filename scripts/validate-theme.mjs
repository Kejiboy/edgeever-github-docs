import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "themes/github-docs/manifest.json"), "utf8"));

const TOKENS = new Set([
  "color.background", "color.surface", "color.surfaceMuted", "color.text", "color.textMuted",
  "color.border", "color.accent", "color.accentForeground", "color.success", "color.warning", "color.danger",
  "font.body", "font.mono", "font.size", "lineHeight.body", "radius.medium", "density.scale", "editor.contentWidth",
]);
const COLORS = new Set([...TOKENS].filter((token) => token.startsWith("color.")));
const FONTS = new Set(["font.body", "font.mono"]);
const LENGTHS = new Set(["font.size", "radius.medium", "editor.contentWidth"]);
const ID = /^[a-z0-9]+(?:[._-][a-z0-9]+)+$/;
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.error(`FAIL ${message}`);
};

const validateTokens = (label, tokens) => {
  for (const [key, value] of Object.entries(tokens)) {
    if (!TOKENS.has(key)) fail(`${label}: unknown token ${key}`);
    if (typeof value !== "string") fail(`${label}.${key}: must be a string`);
  }
  for (const key of TOKENS) {
    if (!(key in tokens)) {
      fail(`${label}: missing ${key}`);
      continue;
    }
    const value = tokens[key];
    if (COLORS.has(key) && !/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(value)) fail(`${label}.${key}: bad color ${value}`);
    if (FONTS.has(key) && (!/^[a-z0-9 ,_'"-]+$/i.test(value) || value.length > 200)) fail(`${label}.${key}: bad font stack`);
    if (LENGTHS.has(key) && !/^\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(value)) fail(`${label}.${key}: bad length ${value}`);
    if (key === "lineHeight.body" && !/^\d+(?:\.\d+)?(?:px|rem|em|%)?$/.test(value)) fail(`${label}.${key}: bad line height`);
    if (key === "density.scale" && !/^(?:0\.[5-9]\d?|1(?:\.\d{1,2})?)$/.test(value)) fail(`${label}.${key}: bad density ${value}`);
  }
};

if (manifest.type !== "theme") fail("type must be theme");
if (!ID.test(manifest.id)) fail(`bad id ${manifest.id}`);
if (!SEMVER.test(manifest.version)) fail(`bad version ${manifest.version}`);
if (manifest.themeApiVersion !== "1") fail("themeApiVersion must be 1");
if (!manifest.name?.trim()) fail("name is required");
if (!Array.isArray(manifest.modes) || manifest.modes.length === 0) fail("modes is required");
for (const mode of manifest.modes ?? []) {
  if (mode !== "light" && mode !== "dark") fail(`unsupported mode ${mode}`);
}
if (manifest.modes?.includes("dark") && !manifest.dark) fail("modes lists dark but no dark tokens are defined");
for (const key of Object.keys(manifest.locales ?? {})) {
  if (!/^[a-z]{2}(?:-[A-Z0-9]{2,3})?$/i.test(key)) fail(`locale key ${key} is not a BCP 47 tag`);
}

validateTokens("light", manifest.light);
validateTokens("dark", manifest.dark ?? {});

const hex = (value) => [1, 3, 5].map((i) => Number.parseInt(value.slice(i, i + 2), 16) / 255);
const luminance = (value) => {
  const [r, g, b] = hex(value).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

const expect = (label, actual, minimum) => {
  console.log(`${actual >= minimum ? "pass" : "FAIL"} ${label}: ${actual.toFixed(2)}:1 (min ${minimum}:1)`);
  if (actual < minimum) fail(`${label} is below ${minimum}:1`);
};

for (const mode of ["light", "dark"]) {
  const t = manifest[mode];
  if (!t) continue;
  expect(`${mode} text/surface`, contrast(t["color.text"], t["color.surface"]), 7);
  expect(`${mode} text/background`, contrast(t["color.text"], t["color.background"]), 7);
  expect(`${mode} muted/surface`, contrast(t["color.textMuted"], t["color.surface"]), 4.5);
  expect(`${mode} muted/surfaceMuted`, contrast(t["color.textMuted"], t["color.surfaceMuted"]), 4.5);
  expect(`${mode} accentForeground/accent`, contrast(t["color.accentForeground"], t["color.accent"]), 4.5);
  expect(`${mode} accent/background`, contrast(t["color.accent"], t["color.background"]), 4.5);
  expect(`${mode} warning/background`, contrast(t["color.warning"], t["color.background"]), 4.5);
  expect(`${mode} danger/background`, contrast(t["color.danger"], t["color.background"]), 4.5);
  expect(`${mode} sidebars stay distinguishable`, contrast(t["color.surfaceMuted"], t["color.surface"]), 1.05);
  expect(`${mode} surface/background layering`, contrast(t["color.surface"], t["color.background"]), 1.02);
}

if (failures > 0) {
  console.error(`\nTheme manifest validation failed with ${failures} problem(s).`);
  process.exit(1);
}
console.log("\nTheme manifest validation passed.");
