type SearchOptions = {
  matchCase?: boolean
  wholeWord?: boolean
  useRegex?: boolean
}

type Matcher = {
  /** Global, so it walks every match in a string. */
  pattern: RegExp
  /** In a regex search, `$1` and `$<name>` in the replacement read the match's groups. */
  useRegex: boolean
}

type SourceFile = {
  /** What a result opens when chosen, usually the path. */
  target: string
  path: string
  content: string
}

type NameMatch = {
  target: string
  name: string
  directory: string
  /** Where the hit falls in `name`, or -1 for none. */
  nameStart: number
  nameEnd: number
  dirStart: number
  dirEnd: number
}

type LineMatch = {
  /** Counted from 1. */
  line: number
  /** The line, trimmed around the hit when it is long. */
  text: string
  start: number
  end: number
  /** What the hit becomes, when a replacement is being previewed. */
  replacement: string | null
}

type FileMatches = {
  target: string
  name: string
  directory: string
  matches: LineMatch[]
  /** Hits in this file past the per-file cap. */
  hidden: number
}

type ContentResults = {
  results: FileMatches[]
  total: number
  /** The search stopped at the overall cap. */
  truncated: boolean
}

class InvalidPatternError extends Error {
  name = "InvalidPatternError"
}

const MAX_PER_FILE = 50
const MAX_TOTAL = 1000
const LINE_WINDOW = 160
const LEAD = 12

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** `null` for an empty query. Throws `InvalidPatternError` for a bad regex. */
function buildMatcher(
  query: string,
  { matchCase = false, wholeWord = false, useRegex = false }: SearchOptions = {}
): Matcher | null {
  if (!query) return null
  let source = useRegex ? query : escapeRegExp(query)
  if (wholeWord) source = `\\b(?:${source})\\b`
  try {
    return {
      pattern: new RegExp(source, matchCase ? "gu" : "giu"),
      useRegex,
    }
  } catch (error) {
    throw new InvalidPatternError(
      error instanceof Error
        ? error.message.replace(
            /^Invalid regular expression: \/.*\/[a-z]*: /,
            ""
          )
        : "Invalid pattern"
    )
  }
}

/** `src/app/page.tsx` to `{ name: "page.tsx", directory: "src/app" }`. */
function splitTarget(path: string) {
  const index = path.lastIndexOf("/")
  return index === -1
    ? { name: path, directory: "" }
    : { name: path.slice(index + 1), directory: path.slice(0, index) }
}

// Every non-empty match, so a pattern like `^` or `a*` can't loop forever.
function* matchesIn(text: string, matcher: Matcher) {
  const pattern = new RegExp(matcher.pattern.source, matcher.pattern.flags)
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    if (match[0] === "") {
      pattern.lastIndex += 1
      continue
    }
    yield match
  }
}

function firstMatch(text: string, matcher: Matcher | null) {
  if (!matcher) return null
  const next = matchesIn(text, matcher).next()
  return next.done ? null : next.value
}

/** Every path when there is no query; the ones whose name or folder matches when there is. */
function searchNames(paths: readonly string[], matcher: Matcher | null) {
  return paths.flatMap((path): NameMatch[] => {
    const { name, directory } = splitTarget(path)
    const inName = firstMatch(name, matcher)
    const inDirectory = inName ? null : firstMatch(directory, matcher)
    if (matcher && !inName && !inDirectory) return []
    return [
      {
        target: path,
        name,
        directory,
        nameStart: inName?.index ?? -1,
        nameEnd: inName ? inName.index + inName[0].length : -1,
        dirStart: inDirectory?.index ?? -1,
        dirEnd: inDirectory ? inDirectory.index + inDirectory[0].length : -1,
      },
    ]
  })
}

// `$&`, `$1`–`$99`, `$<name>` and `$$`, as `String.replace` reads them.
function expand(replacement: string, match: RegExpExecArray) {
  return replacement.replace(
    /\$(\$|&|\d{1,2}|<([^>]+)>)/g,
    (token, key: string, name?: string) => {
      if (key === "$") return "$"
      if (key === "&") return match[0]
      if (name !== undefined) return match.groups?.[name] ?? ""
      const group = Number(key)
      return group > 0 && group < match.length ? (match[group] ?? "") : token
    }
  )
}

// Gives the replacement the case shape of what it replaces: ALL CAPS, all
// lower, or a capital first letter.
function matchCase(found: string, replacement: string) {
  if (found === found.toUpperCase() && found !== found.toLowerCase()) {
    return replacement.toUpperCase()
  }
  if (found === found.toLowerCase()) return replacement.toLowerCase()
  if (found[0] === found[0]?.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function replacementFor(
  match: RegExpExecArray,
  matcher: Matcher,
  replacement: string,
  preserveCase: boolean
) {
  const value = matcher.useRegex ? expand(replacement, match) : replacement
  return preserveCase ? matchCase(match[0], value) : value
}

// Indentation goes, and a long run before the hit is cut to a few
// characters, so the hit stays in sight in a narrow list.
function trimAround(line: string, start: number, end: number) {
  const indent = line.length - line.trimStart().length
  let from = Math.min(indent, start)
  if (start - from > LEAD) from = start - LEAD
  const to = Math.min(line.length, Math.max(end, from + LINE_WINDOW))
  const head = from > indent ? "…" : ""
  return {
    text: head + line.slice(from, to) + (to < line.length ? "…" : ""),
    start: start - from + head.length,
    end: end - from + head.length,
  }
}

function searchContents(
  files: readonly SourceFile[],
  matcher: Matcher | null,
  {
    value = "",
    enabled = false,
    preserveCase = false,
  }: { value?: string; enabled?: boolean; preserveCase?: boolean } = {}
): ContentResults {
  const results: FileMatches[] = []
  let total = 0
  let truncated = false
  if (!matcher) return { results, total, truncated }

  for (const file of files) {
    if (truncated) break
    const { name, directory } = splitTarget(file.path)
    const matches: LineMatch[] = []
    let hidden = 0

    file.content.split("\n").forEach((line, index) => {
      if (truncated) return
      for (const match of matchesIn(line, matcher)) {
        if (total >= MAX_TOTAL) {
          truncated = true
          return
        }
        total += 1
        if (matches.length >= MAX_PER_FILE) {
          hidden += 1
          continue
        }
        const trimmed = trimAround(
          line,
          match.index,
          match.index + match[0].length
        )
        matches.push({
          line: index + 1,
          ...trimmed,
          replacement: enabled
            ? replacementFor(match, matcher, value, preserveCase)
            : null,
        })
      }
    })

    if (matches.length > 0) {
      results.push({ target: file.target, name, directory, matches, hidden })
    }
  }

  return { results, total, truncated }
}

function replaceAll(
  content: string,
  matcher: Matcher,
  replacement: string,
  preserveCase = false
) {
  let count = 0
  // Line by line, the way the search reads it, so what it replaces is
  // exactly what it listed.
  const lines = content.split("\n").map((line) => {
    let output = ""
    let from = 0
    for (const match of matchesIn(line, matcher)) {
      output +=
        line.slice(from, match.index) +
        replacementFor(match, matcher, replacement, preserveCase)
      from = match.index + match[0].length
      count += 1
    }
    return output + line.slice(from)
  })
  return { content: lines.join("\n"), count }
}

export {
  InvalidPatternError,
  buildMatcher,
  replaceAll,
  searchContents,
  searchNames,
  splitTarget,
}
export type {
  ContentResults,
  FileMatches,
  LineMatch,
  Matcher,
  NameMatch,
  SearchOptions,
  SourceFile,
}
