// Checks every item with a card against the code rules in the design skill's
// checklist (.claude/skills/design/SKILL.md) and writes lib/audit.json, which
// the gallery cards read to show Passed or Failed.
//
//   node scripts/audit-design.mjs                 static checks only
//   node scripts/audit-design.mjs --render URL    also open /demo/<name> on a
//                                                 running site, at desktop and
//                                                 phone width
//
// The checklist's visual lines (light and dark, keyboard, squint) still need a
// person; this covers what can be read off the source and the rendered demo.

import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import ts from "typescript"

const ROOT = path.resolve(import.meta.dirname, "..")
const OUT = path.join(ROOT, "lib/audit.json")
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry.json"), "utf8"))
const demosSource = fs.readFileSync(path.join(ROOT, "lib/demos.tsx"), "utf8")

const RULES = {
  "brand-token": {
    section: "Brand",
    title: "Brand ink is written as live, never blue, brand, a hex or a dark: twin",
  },
  "raw-colour": {
    section: "Brand",
    title: "Colour comes from a theme token, never a raw Tailwind shade",
  },
  "shadow-depth": {
    section: "Surfaces",
    title: "Shadows stop at shadow-lg, with no custom, coloured or drop shadows",
  },
  radius: {
    section: "Surfaces",
    title: "Nothing is rounder than rounded-xl except circles and capsules",
  },
  "site-import": {
    section: "Components",
    title: "Registry code imports no site code and hard-wires no /api/ call",
  },
  "registry-deps": {
    section: "Components",
    title: "Every registry file and package it imports is listed on its item",
  },
  "transition-all": {
    section: "Motion",
    title: "Transitions name their properties, never transition-all",
  },
  duration: {
    section: "Motion",
    title: "Durations are 70, 80, 150 or 280 ms",
  },
  easing: {
    section: "Motion",
    title: "Curves are the system's ease-out or ease-in, not Tailwind's own",
  },
  "reduced-motion": {
    section: "Motion",
    title: "Every transition and animation has its motion-reduce escape on the same element",
  },
  scale: {
    section: "Motion",
    title: "Nothing grows on hover, and presses dent at 0.97 or 0.90 only",
  },
  copy: {
    section: "Copy",
    title: "No “Loading”, “Something went wrong”, “simply” or “seamlessly”",
  },
  focus: {
    section: "Accessibility",
    title: "Focus shows on focus-visible only, in ring at full strength",
  },
  "icon-label": {
    section: "Accessibility",
    title: "Icons are Hugeicons, aria-hidden unless they carry a label",
  },
  "real-controls": {
    section: "Accessibility",
    title: "Controls are real buttons, links or inputs, never a clickable div",
  },
  "tabs-line": {
    section: "Components",
    title: "Tabs use the segmented track, never variant=\"line\"",
  },
  demo: {
    section: "Look at it",
    title: "It has a demo and opens full screen at /demo/<name>",
  },
  render: {
    section: "Look at it",
    title: "Its demo renders without errors, and fits a phone without scrolling sideways",
  },
}

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
const COLOUR_UTIL =
  "text|bg|border|border-[trblxyse]|ring|ring-offset|fill|stroke|from|via|to|outline|divide|placeholder|caret|accent|decoration|shadow"
const DURATIONS = new Set(["0", "70", "80", "150", "280"])
const CURVES = new Set(["0.16,1,0.3,1", ".16,1,.3,1", "0.4,0,1,1", ".4,0,1,1"])
const SKIP_PACKAGES = new Set(["react", "react-dom", "next"])

function classTokens(text) {
  return text.split(/[\s"'`]+/).filter(Boolean)
}

// The utility a token sets, without its variants: "dark:hover:bg-x" -> "bg-x".
function utility(token) {
  let depth = 0
  let last = 0
  for (let i = 0; i < token.length; i++) {
    const c = token[i]
    if (c === "[" || c === "(") depth++
    else if (c === "]" || c === ")") depth--
    else if (c === ":" && depth === 0) last = i + 1
  }
  return token.slice(last).replace(/^!|!$/g, "")
}

function checkClasses(text, add) {
  const tokens = classTokens(text)
  for (const token of tokens) {
    const u = utility(token)
    const variants = token.slice(0, token.length - u.length)
    if (/(^|-)(blue|brand)(-|$)/.test(u) && new RegExp(`^(${COLOUR_UTIL})-`).test(u))
      add("brand-token", token)
    else if (/\[#[0-9a-f]{3,8}\]/i.test(u)) add("brand-token", token)
    else if (/^(text|bg|border|ring|fill|stroke)-live/.test(u) && variants.includes("dark:"))
      add("brand-token", token)
    if (new RegExp(`^(${COLOUR_UTIL})-(${PALETTE})-\\d{2,3}`).test(u)) add("raw-colour", token)
    if (/^shadow-(xl|2xl|\[)/.test(u) || /^drop-shadow/.test(u) || /^shadow-(live|blue)/.test(u))
      add("shadow-depth", token)
    if (/^rounded(-[a-z]+)?-(2xl|3xl)$/.test(u)) add("radius", token)
    if (u === "transition-all") add("transition-all", token)
    const d = /^duration-(\d+|\[(\d+)ms\])$/.exec(u)
    if (d && !DURATIONS.has(d[2] ?? d[1])) add("duration", token)
    if (/^ease-(in|out|in-out)$/.test(u)) add("easing", token)
    const curve = /^ease-\[cubic-bezier\(([^)]*)\)\]$/.exec(u)
    if (curve && !CURVES.has(curve[1].replace(/[\s_]/g, ""))) add("easing", token)
    if (variants.includes("hover:") && /^-?scale-(1\d\d|\[1\.)/.test(u)) add("scale", token)
    if (variants.includes("active:") && /^scale-/.test(u) && !/^scale-(\[0\.97\]|90)$/.test(u))
      add("scale", token)
    if (/(^|:)focus:/.test(token) && /^(ring|border|outline)/.test(u)) add("focus", token)
    if (variants.includes("focus-visible:") && /^ring-(ring\/\d+|\[3px\])$/.test(u))
      add("focus", token)
  }
  // motion-safe: only applies when motion is allowed, so it needs no escape.
  const moving = tokens.filter((t) => !t.includes("motion-safe:"))
  const hasTransition = moving.some((t) => /^transition(-|$)/.test(utility(t)) && utility(t) !== "transition-none")
  const escaped = (none) =>
    tokens.some((t) => utility(t) === none && t.slice(0, -utility(t).length).includes("motion-reduce:"))
  if (hasTransition && !escaped("transition-none"))
    add("reduced-motion", "a transition with no motion-reduce:transition-none")
  const hasAnimation = moving.some((t) => {
    const u = utility(t)
    return (/^animate-/.test(u) && u !== "animate-none") || u === "shimmer"
  })
  if (hasAnimation && !escaped("animate-none"))
    add("reduced-motion", "an animation with no motion-reduce:animate-none")
}

// A "class group" is everything that styles one element: a className
// attribute, a cn()/cva() call, or a string kept in a variable. The escape has
// to sit in the same group as the motion it stops.
function isClassGroup(node) {
  if (ts.isJsxAttribute(node)) return /^(className|class)$/.test(node.name.getText())
  if (ts.isCallExpression(node)) return /^(cn|cva|clsx|twMerge)$/.test(node.expression.getText())
  return false
}

function looksLikeClasses(text) {
  const tokens = classTokens(text)
  return tokens.length > 0 && tokens.every((t) => /^[!a-z0-9[\]():/._%&>*@=,#'"-]+$/i.test(t)) &&
    tokens.some((t) => /^(?:[a-z-]+:)*(flex|grid|text-|bg-|p[xy]?-|m[xy]?-|gap-|rounded|border|size-|w-|h-|transition|animate-|duration-|shadow|ring|items-|justify-|font-|inline|block|hidden|absolute|relative)/.test(t))
}

function stringText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node))
    return [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join(" ")
  return null
}

// Wrappers that already hide what they hold from assistive tech.
const HIDING_WRAPPERS = new Set(["TraceIcon"])

function insideHidden(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isJsxElement(n)) {
      const open = n.openingElement
      if (HIDING_WRAPPERS.has(open.tagName.getText())) return true
      if (open.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText() === "aria-hidden")) return true
    }
  }
  return false
}

function auditSource(file, { demo = false } = {}) {
  const source = fs.readFileSync(path.join(ROOT, file), "utf8")
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const failures = []
  const imports = []
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
  const demoRules = new Set(["brand-token", "raw-colour", "transition-all", "tabs-line"])
  const record = (node) => (rule, text) => {
    if (demo && !demoRules.has(rule)) return
    failures.push({ rule, file, line: lineOf(node), text: String(text).slice(0, 120) })
  }

  function visit(node, inGroup) {
    if (!inGroup && (isClassGroup(node) || (ts.isVariableDeclaration(node) && node.initializer && stringText(node.initializer) && looksLikeClasses(stringText(node.initializer))))) {
      const text = []
      const collect = (n) => {
        const s = stringText(n)
        if (s !== null) text.push(s)
        n.forEachChild(collect)
      }
      collect(node)
      checkClasses(text.join(" "), record(node))
      node.forEachChild((child) => visit(child, true))
      return
    }

    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const spec = node.moduleSpecifier && stringText(node.moduleSpecifier)
      if (spec) imports.push({ spec, node, typeOnly: !!node.importClause?.isTypeOnly })
      return
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const spec = node.arguments[0] && stringText(node.arguments[0])
      if (spec) imports.push({ spec, node })
    }

    // Copy, in strings people read.
    const text = ts.isJsxText(node) ? node.text : !inGroup ? stringText(node) : null
    if (text && !ts.isImportDeclaration(node.parent)) {
      const add = record(node)
      if (/\bLoading\b/.test(text) && !looksLikeClasses(text)) add("copy", text.trim())
      if (/something went wrong/i.test(text)) add("copy", text.trim())
      if (/\b(simply|seamlessly)\b/i.test(text) && !looksLikeClasses(text)) add("copy", text.trim())
    }
    if (ts.isCallExpression(node) && node.expression.getText() === "fetch") {
      const arg = node.arguments[0] && stringText(node.arguments[0])
      if (arg && arg.startsWith("/api/")) record(node)("site-import", `fetch("${arg}")`)
    }

    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText()
      const attrs = node.attributes.properties
      const has = (name) => attrs.some((a) => ts.isJsxSpreadAttribute(a) || a.name?.getText() === name)
      const attr = (name) => attrs.find((a) => ts.isJsxAttribute(a) && a.name.getText() === name)
      if (tag === "HugeiconsIcon" && !has("aria-hidden") && !has("aria-label") && !has("title") && !insideHidden(node))
        record(node)("icon-label", "<HugeiconsIcon> with no aria-hidden or label")
      // A click caught for the buttons inside it (`closest(...)`) is delegation, not a control.
      if (/^(div|span|li|td|tr|img|p|section)$/.test(tag) && attr("onClick") && !has("role") &&
        !/closest\(/.test(attr("onClick").getText()))
        record(node)("real-controls", `<${tag} onClick>`)
      const variant = attr("variant")
      if (/^Tabs(List)?$/.test(tag) && variant?.initializer && stringText(variant.initializer) === "line")
        record(node)("tabs-line", `<${tag} variant="line">`)
    }

    // Motion driven from JavaScript checks reduced motion itself.
    if (ts.isCallExpression(node) && /\.animate$/.test(node.expression.getText()) &&
      !/prefers-reduced-motion|useReducedMotion|reducedMotion/i.test(source)) {
      record(node)("reduced-motion", `${node.expression.getText()}() with no prefers-reduced-motion check`)
    }

    node.forEachChild((child) => visit(child, inGroup))
  }
  visit(sf, false)
  return { failures, imports }
}

function packageRoot(spec) {
  const parts = spec.split("/")
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function auditItem(item) {
  const failures = []
  const ownBasenames = new Set(item.files.map((f) => path.basename(f.path).replace(/\.tsx?$/, "")))
  const regDeps = new Set((item.registryDependencies ?? []).map((d) => d.replace(/^@aiellie\//, "")))
  const deps = new Set((item.dependencies ?? []).map((d) => d.replace(/@[\d^~].*$/, "")))

  for (const { path: file } of item.files) {
    if (!/\.(tsx?|mts)$/.test(file)) continue
    const { failures: found, imports } = auditSource(file)
    failures.push(...found)
    for (const { spec, node, typeOnly } of imports) {
      const sf = node.getSourceFile()
      const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
      const add = (rule, text) => failures.push({ rule, file, line, text })
      if (/^@\/(components|app)\//.test(spec) || (spec.startsWith("@/lib/") && spec !== "@/lib/utils"))
        add("site-import", spec)
      else if (spec.startsWith("@/registry/aiellie/")) {
        const name = path.basename(spec)
        if (!ownBasenames.has(name) && !regDeps.has(name)) add("registry-deps", `${spec} is not in registryDependencies`)
      } else if (spec === "@/lib/utils") {
        if (!regDeps.has("utils")) add("registry-deps", "@/lib/utils without @aiellie/utils")
      } else if (spec.startsWith(".")) {
        // Relative imports resolve inside the item.
      } else if (!spec.startsWith("node:") && !typeOnly) {
        const pkg = packageRoot(spec)
        if (/^(lucide-react|react-icons|@radix-ui\/react-icons|@tabler\/icons-react|@heroicons\/react)$/.test(pkg))
          add("icon-label", `${pkg}: icons come from Hugeicons only`)
        if (!SKIP_PACKAGES.has(pkg) && !deps.has(pkg)) add("registry-deps", `${pkg} is not in dependencies`)
      }
    }
  }

  const demoFile = `registry/aiellie/examples/${item.name}-demo.tsx`
  if (!fs.existsSync(path.join(ROOT, demoFile))) {
    failures.push({ rule: "demo", file: demoFile, line: 0, text: "no demo file" })
  } else {
    failures.push(...auditSource(demoFile, { demo: true }).failures)
    const key = item.name.includes("-") ? `"${item.name}": {` : `${item.name}: {`
    if (!demosSource.includes(`\n  ${key}`))
      failures.push({ rule: "demo", file: "lib/demos.tsx", line: 0, text: `no DEMOS entry for ${item.name}` })
  }
  return failures
}

async function renderChecks(base, names) {
  // Playwright isn't a dependency here; take it from wherever it's installed.
  const { chromium } = createRequire(import.meta.url)("playwright")
  const browser = await chromium.launch()
  const results = {}
  for (const name of names) {
    const failures = []
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport })
      const errors = []
      page.on("pageerror", (error) => errors.push(error.message))
      page.on("console", (message) => {
        if (message.type() === "error" && !/Failed to load resource|favicon|net::ERR/i.test(message.text()))
          errors.push(message.text())
      })
      try {
        const response = await page.goto(`${base}/demo/${name}`, { waitUntil: "networkidle", timeout: 45000 })
        if (!response || response.status() >= 400) errors.push(`/demo/${name} answered ${response?.status()}`)
        await page.waitForTimeout(600)
        if (viewport.width === 390) {
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
          if (overflow > 1) errors.push(`scrolls sideways by ${overflow}px at 390px wide`)
        }
      } catch (error) {
        errors.push(String(error.message ?? error).split("\n")[0])
      }
      for (const text of [...new Set(errors)].slice(0, 3))
        failures.push({ rule: "render", file: `/demo/${name}`, line: 0, text: `${viewport.width}px: ${text.slice(0, 160)}` })
      await page.close()
    }
    results[name] = failures
    process.stdout.write(failures.length ? "x" : ".")
  }
  await browser.close()
  process.stdout.write("\n")
  return results
}

const carded = registry.items.filter(
  (item) => (item.type === "registry:ui" || item.type === "registry:component") && item.categories?.length
)

const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : { items: {} }
const renderAt = process.argv.indexOf("--render")
const rendered = renderAt > -1 ? await renderChecks(process.argv[renderAt + 1], carded.map((i) => i.name)) : null

const items = {}
for (const item of carded) {
  const failures = auditItem(item)
  const render = rendered
    ? rendered[item.name]
    : (previous.items[item.name]?.failures ?? []).filter((f) => f.rule === "render")
  failures.push(...render)
  const seen = new Set()
  const unique = failures.filter((f) => {
    const key = `${f.rule}|${f.file}|${f.line}|${f.text}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  items[item.name] = {
    passed: unique.length === 0,
    rendered: rendered ? true : (previous.items[item.name]?.rendered ?? false),
    failures: unique,
  }
}

fs.writeFileSync(OUT, JSON.stringify({ rules: RULES, items }, null, 2) + "\n")
const failed = Object.entries(items).filter(([, v]) => !v.passed)
console.log(`${carded.length - failed.length} passed, ${failed.length} failed`)
const byRule = {}
for (const [, v] of failed) for (const f of v.failures) byRule[f.rule] = (byRule[f.rule] ?? 0) + 1
console.log(byRule)
