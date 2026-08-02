#!/usr/bin/env node
/**
 * Static guard for the CSS Modules migration.
 *
 * A mistyped key is the dangerous failure mode of CSS Modules: `styles.valuSm`
 * resolves to `undefined`, React drops the attribute, and the element renders
 * unstyled with no error, no warning and a green build. Nothing in tsc, eslint
 * or `next build` catches it.
 *
 * This walks every .ts/.tsx file, resolves each `*.module.scss` it imports,
 * collects the class selectors that sheet actually defines, and fails on any
 * `styles.someKey` that has no matching selector. It also lists selectors no
 * component references, which catches the opposite slip — rules left behind
 * when markup changed.
 *
 *   node scripts/check-module-classes.mjs            # report + exit 1 on error
 *   node scripts/check-module-classes.mjs --unused   # also list dead selectors
 *
 * Runs in ~50ms with no build step, so it belongs in front of every commit
 * during the migration.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SCAN_DIRS = ["app", "Components", "modules", "customHooks", "redux", "utils"];
const SHOW_UNUSED = process.argv.includes("--unused");

// --- collect source files --------------------------------------------------
function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));

// --- parse a module stylesheet into its set of exported class names -------
const sheetCache = new Map();

function classesOf(sheetPath) {
  if (sheetCache.has(sheetPath)) return sheetCache.get(sheetPath);

  let css;
  try {
    css = readFileSync(sheetPath, "utf8");
  } catch {
    sheetCache.set(sheetPath, null); // missing sheet
    return null;
  }

  // Strip comments so commented-out rules do not count as defined.
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  const names = new Set();
  // Any class selector, at any nesting depth: ".foo", ".foo:hover", ".a, .b {"
  for (const m of css.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) {
    names.add(m[1]);
  }

  sheetCache.set(sheetPath, names);
  return names;
}

// --- walk each file's module imports and usages ---------------------------
const errors = [];
const usedBySheet = new Map(); // sheetPath -> Set(keys referenced anywhere)

for (const file of files) {
  const src = readFileSync(file, "utf8");

  // import styles from "./X.module.scss"  |  import s from "@/…/X.module.css"
  const imports = [
    ...src.matchAll(
      /import\s+(\w+)\s+from\s+["']([^"']+\.module\.(?:scss|css))["']/g
    ),
  ];
  if (!imports.length) continue;

  for (const [, binding, spec] of imports) {
    const sheetPath = spec.startsWith("@/")
      ? join(ROOT, spec.slice(2))
      : resolve(dirname(file), spec);

    const defined = classesOf(sheetPath);
    if (defined === null) {
      errors.push(
        `${relative(ROOT, file)}\n    imports a stylesheet that does not exist: ${spec}`
      );
      continue;
    }

    if (!usedBySheet.has(sheetPath)) usedBySheet.set(sheetPath, new Set());
    const used = usedBySheet.get(sheetPath);

    // styles.foo  and  styles["foo"]
    const refs = [
      ...src.matchAll(new RegExp(`\\b${binding}\\.(\\w+)`, "g")),
      ...src.matchAll(new RegExp(`\\b${binding}\\[["'](\\w+)["']\\]`, "g")),
    ];

    for (const [, key] of refs) {
      used.add(key);
      if (!defined.has(key)) {
        const near = [...defined]
          .filter((d) => d.toLowerCase().startsWith(key.slice(0, 3).toLowerCase()))
          .slice(0, 4);
        errors.push(
          `${relative(ROOT, file)}\n    ${binding}.${key} is not defined in ${relative(ROOT, sheetPath)}` +
            (near.length ? `\n    did you mean: ${near.join(", ")}?` : "")
        );
      }
    }
  }
}

// --- report ---------------------------------------------------------------
if (errors.length) {
  console.error(`\n✖ ${errors.length} undefined CSS Module reference(s):\n`);
  for (const e of errors) console.error("  " + e + "\n");
} else {
  const sheets = usedBySheet.size;
  const keys = [...usedBySheet.values()].reduce((n, s) => n + s.size, 0);
  console.log(`✔ ${keys} CSS Module references across ${sheets} stylesheet(s) all resolve.`);
}

if (SHOW_UNUSED) {
  console.log("\nSelectors defined but never referenced:");
  let any = false;
  for (const [sheetPath, used] of usedBySheet) {
    const defined = classesOf(sheetPath) ?? new Set();
    const dead = [...defined].filter((d) => !used.has(d));
    if (dead.length) {
      any = true;
      console.log(`  ${relative(ROOT, sheetPath)}\n    ${dead.join(", ")}`);
    }
  }
  if (!any) console.log("  (none)");
}

process.exit(errors.length ? 1 : 0);
