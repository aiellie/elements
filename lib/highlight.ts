export type TokenKind =
  | "comment"
  | "string"
  | "number"
  | "function"
  | "keyword"
  | "punctuation"
  | "plain"

export interface Token {
  text: string
  kind: TokenKind
}

/**
 * Enough of a highlighter for a transcript, not a parser: one pass of
 * alternation over comments, strings, numbers, call sites, words, and
 * punctuation. An assistant answers in whichever language was asked about, so
 * one keyword set spanning the common ones beats a grammar per language at
 * this size — a language name labels the code, it does not switch the scanner.
 */
const KEYWORDS = new Set(
  (
    "and as async await break case catch class const continue def default " +
    "delete do elif else export extends false finally for from function if " +
    "import in instanceof interface lambda let new none not null of or pass " +
    "return self static super switch this throw true try type typeof " +
    "undefined var void while with yield"
  ).split(" ")
)

/**
 * Comments and strings come first so a keyword inside either stays quiet, and
 * `#` only opens a comment at the start of a line, where no language spends it
 * on something else. Multi-line matches (block comments, template strings) are
 * split back into rows by `tokenize`.
 */
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|^[ \t]*#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d[\w.]*)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)|([^\w\s])/gm

/**
 * Four hues, each meaning exactly one thing, and everything that is not a
 * hue kept quiet.
 *
 * The earlier set spent emerald on both comments and numbers and indigo on
 * both keywords and punctuation, which left two pairs a reader could not
 * tell apart and made every brace shout as loudly as `return`. Comments and
 * punctuation carry no hue at all now — a comment is words and punctuation
 * is symbols, so nothing is confusable between them, and neither is
 * competing with the code for attention.
 *
 * The light steps are a shade darker than the dark ones are light, since a
 * mid-weight hue that sits nicely on a dark surface is too pale on a white
 * one.
 */
export const TOKEN_COLORS: Record<TokenKind, string> = {
  comment: "text-foreground/40 italic",
  string: "text-emerald-700 dark:text-emerald-400",
  number: "text-amber-700 dark:text-amber-400",
  keyword: "text-violet-600 dark:text-violet-400",
  function: "text-blue-600 dark:text-blue-400",
  punctuation: "text-foreground/45",
  plain: "text-foreground/80",
}

/**
 * The same distinctions with the hue taken out: what colour was carrying,
 * weight carries instead — comments furthest back, literals a step behind the
 * words, punctuation between them, and the names at full strength with the
 * keywords a weight above even those.
 *
 * Every step is the foreground at a fraction, so the ramp inverts with the
 * theme and holds against either background without a `dark:` of its own.
 */
export const TOKEN_COLORS_MONO: Record<TokenKind, string> = {
  comment: "text-foreground/35 italic",
  string: "text-foreground/60",
  number: "text-foreground/60",
  /* The one step that is a weight and not an alpha. Without it a keyword and
       the name beside it are the same colour at the same weight, which is the
       one distinction this palette cannot afford to lose. */
  keyword: "font-medium text-foreground",
  function: "text-foreground",
  punctuation: "text-foreground/40",
  plain: "text-foreground/75",
}

/**
 * The pair a diff is read in. Deliberately not tokens: `lib/colors` names
 * nothing for "added" and "removed", and minting two would put them in
 * `/tokens` as though anything on the page could reach for them. They belong
 * here beside the token colours because they are the same kind of thing — a
 * hue that says something about the code rather than about the interface
 * around it.
 *
 * Emerald is the one the scanner already spends on strings, so a green row
 * and a green literal agree. Red is this pair's alone: nothing in the token
 * set uses it, which is what keeps a removed row unmistakable.
 *
 * The tint goes on the row and the hue on the mark, leaving the code itself
 * to keep its own colouring: a changed line is still code, and a reader
 * needs to see what kind before they can judge the change.
 */
export const DIFF_ROW: Record<"add" | "remove", string> = {
  add: "bg-emerald-500/[0.08] dark:bg-emerald-400/[0.12]",
  remove: "bg-red-500/[0.07] dark:bg-red-400/[0.11]",
}

export const DIFF_MARK: Record<"add" | "remove", string> = {
  add: "text-emerald-700 dark:text-emerald-400",
  remove: "text-red-600 dark:text-red-400",
}

export type TokenPalette = "color" | "mono"

/** The palettes a code element offers, for one to be chosen by name. */
export const TOKEN_PALETTES: Record<TokenPalette, Record<TokenKind, string>> = {
  color: TOKEN_COLORS,
  mono: TOKEN_COLORS_MONO,
}

function kindOf(match: RegExpMatchArray): TokenKind {
  const [, comment, string, number, call, word] = match
  if (comment) return "comment"
  if (string) return "string"
  if (number) return "number"
  /* A keyword is a keyword even in call position — `while (x)`, `if (x)`,
     `return (x)` all put a paren after a word the language reserved. The
     call-site group only decides the kind of a name the language left free. */
  if (call) return KEYWORDS.has(call) ? "keyword" : "function"
  if (word) return KEYWORDS.has(word) ? "keyword" : "plain"
  return "punctuation"
}

/** `code` as rows of tokens, one row per line, blank lines kept as empty. */
export function tokenize(code: string): Token[][] {
  const lines: Token[][] = [[]]

  const push = (text: string, kind: TokenKind) => {
    text.split("\n").forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, kind })
    })
  }

  let last = 0
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) push(code.slice(last, index), "plain")
    push(match[0], kindOf(match))
    last = index + match[0].length
  }
  if (last < code.length) push(code.slice(last), "plain")

  return lines
}

/** A URL, or a path that leads with a slash or a dot-slash. */
const URLISH = /^([a-z][\w+.-]*:\/\/|\.{0,2}\/)/i

/**
 * A shell command as one row of tokens, in the same vocabulary as `tokenize`
 * so a command line reads like the code above it: the program at full
 * strength, flags in the accent, and URLs and versions as the literals they
 * are.
 *
 * A command is one line and is not a language, so it gets its own pass rather
 * than the keyword set — `add` means nothing to a grammar and everything here.
 * Whitespace is kept as its own token, since the line is rendered `pre` and
 * has to come back out exactly as it went in.
 */
export function tokenizeCommand(command: string): Token[] {
  const tokens: Token[] = []

  const push = (text: string, kind: TokenKind) => {
    if (text) tokens.push({ text, kind })
  }

  command.split(/(\s+)/).forEach((word, index) => {
    if (!word) return
    if (/^\s+$/.test(word)) return push(word, "plain")
    /* The program being run leads the line, and is the one word on it that
         says what is about to happen. */
    if (index === 0) return push(word, "function")
    if (word.startsWith("-")) return push(word, "keyword")
    if (URLISH.test(word)) return push(word, "string")

    /* `pkg@version` splits so the version reads as the literal it is. A
         leading `@` is a scope, not a separator, so the search starts past it. */
    const at = word.indexOf("@", 1)
    if (at > 0) {
      push(word.slice(0, at), "plain")
      push("@", "punctuation")
      push(word.slice(at + 1), "number")
      return
    }

    push(word, "plain")
  })

  return tokens
}
