#!/usr/bin/env node

import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import * as p from "@clack/prompts"

/**
 * Where items are installed from. It can be pointed at a local build of the
 * registry, so a change can be tried before it is deployed:
 *
 *   AIELLIE_REGISTRY_URL=http://localhost:3000/r npx aiellie init
 */
const REGISTRY_URL = (
  process.env.AIELLIE_REGISTRY_URL ?? "https://elements.aiellie.dev/r"
).replace(/\/+$/, "")

/**
 * The shadcn CLI does the installing. It is pinned to a major version, so a
 * breaking shadcn release can't change what an install does without this
 * package changing first.
 */
const SHADCN = "shadcn@4"

const PACKAGE_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, "template")
const { version } = JSON.parse(
  fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8")
)

const HELP = `
Usage: aiellie <command> [options]

Commands
  init [directory]   Create a chat app, or add the chat to the project you're in
  add <names...>     Add items from the aiellie registry, e.g. aiellie add composer

Options
  -y, --yes          Use the defaults instead of asking
  -o, --overwrite    Replace files that already exist
  -h, --help         Show this help
  -v, --version      Show the version

Everything in the registry: https://elements.aiellie.dev
`

/** Files a folder can hold and still count as empty enough for a new app. */
const IGNORABLE = new Set([
  ".DS_Store",
  ".git",
  ".idea",
  ".vscode",
  "Thumbs.db",
])

/** How each package manager runs a package it doesn't have installed. */
const RUNNERS = {
  npm: ["npx", ["--yes"]],
  pnpm: ["pnpm", ["dlx"]],
  yarn: ["yarn", ["dlx"]],
  bun: ["bunx", ["--bun"]],
}

class CommandError extends Error {
  constructor(message, output) {
    super(message)
    this.output = output
  }
}

/**
 * The package manager this command was run with. npx, pnpm dlx, yarn dlx and
 * bunx each leave their name in the user agent, so a new app is installed with
 * the manager the person reached for.
 */
function managerFromUserAgent() {
  const agent = process.env.npm_config_user_agent ?? ""
  for (const manager of ["pnpm", "yarn", "bun"]) {
    if (agent.startsWith(manager)) return manager
  }
  return "npm"
}

/** An existing project's lockfile says which manager it uses. */
function managerForProject(dir) {
  const lockfiles = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"],
  ]
  for (const [file, manager] of lockfiles) {
    if (fs.existsSync(path.join(dir, file))) return manager
  }
  return managerFromUserAgent()
}

/**
 * Questions shadcn can ask partway through an install, and the answer a run
 * that nobody is watching gives: keep the file that's already there, and take
 * the first suggestion for npm's React 19 peer dependency question.
 *
 * shadcn asks the first one even with `--yes`, and a closed input doesn't
 * answer it: shadcn quits on the spot, reports success, and installs nothing
 * after the file it asked about. So the answer has to be typed in.
 */
const UNATTENDED_ANSWERS = [
  [/Would you like to overwrite\? › \(y\/N\)/g, "n"],
  [/How would you like to proceed\?[\s\S]*?Return to submit/g, "\r"],
]

/**
 * shadcn's summary of the files it wrote. It only asks questions before this,
 * and once it has asked one it keeps listening until its input closes, so this
 * is the moment to close it.
 */
const FILES_SETTLED = /(Created|Updated|Skipped) \d+ files?|No files updated/

const stripAnsi = (text) => text.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "")

/**
 * Runs a command in `cwd`.
 *
 * Quiet runs keep their output and only show it if the command fails, so a
 * spinner isn't buried under install logs. Unattended runs answer shadcn's
 * questions themselves, for `--yes` and for runs with no terminal to ask in.
 */
function run(command, args, cwd, { quiet = true, unattended = true } = {}) {
  return new Promise((resolve, reject) => {
    const captured = quiet || unattended
    const child = spawn(command, args, {
      cwd,
      stdio: [
        unattended ? "pipe" : "inherit",
        captured ? "pipe" : "inherit",
        captured ? "pipe" : "inherit",
      ],
      // Windows only finds npx, pnpm and the rest through a shell.
      shell: process.platform === "win32",
    })

    let output = ""
    const answered = UNATTENDED_ANSWERS.map(() => 0)
    const onData = (stream) => (chunk) => {
      output += chunk
      if (!quiet) stream.write(chunk)
      if (!unattended || child.stdin.writableEnded) return
      const text = stripAnsi(output)
      UNATTENDED_ANSWERS.forEach(([question, answer], index) => {
        const asked = text.match(question)?.length ?? 0
        for (; answered[index] < asked; answered[index]++) {
          child.stdin.write(answer)
        }
      })
      if (FILES_SETTLED.test(text)) child.stdin.end()
    }
    child.stdout?.on("data", onData(process.stdout))
    child.stderr?.on("data", onData(process.stderr))
    child.on("error", (error) => reject(new CommandError(error.message)))
    child.on("close", (code) => {
      if (code === 0) resolve(output)
      else
        reject(new CommandError(`${command} ${args.join(" ")} failed.`, output))
    })
  })
}

/** Runs the shadcn CLI through the given manager's runner. */
function shadcn(manager, args, cwd, options) {
  const [runner, runnerArgs] = RUNNERS[manager]
  return run(runner, [...runnerArgs, SHADCN, ...args], cwd, options)
}

/**
 * Makes sure the project knows where `@aiellie/...` comes from. Registry items
 * name their dependencies that way, and shadcn refuses to install them for a
 * project that has never heard of the namespace.
 */
function ensureRegistry(projectDir, { replace = false } = {}) {
  const file = path.join(projectDir, "components.json")
  const config = JSON.parse(fs.readFileSync(file, "utf8"))
  if (config.registries?.["@aiellie"] && !replace) return
  config.registries = {
    ...config.registries,
    "@aiellie": `${REGISTRY_URL}/{name}.json`,
  }
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`)
}

function isEmpty(dir) {
  return (
    !fs.existsSync(dir) ||
    fs.readdirSync(dir).every((entry) => IGNORABLE.has(entry))
  )
}

/** A folder name made safe to use as an npm package name. */
function packageName(dir) {
  const name = path
    .basename(dir)
    .toLowerCase()
    .replace(/[^a-z0-9-._~]+/g, "-")
    .replace(/^[-._]+|-+$/g, "")
  return name || "chat"
}

function exitIfCancelled(value) {
  if (p.isCancel(value)) {
    p.cancel("Cancelled.")
    process.exit(0)
  }
  return value
}

/** Works out where a new app goes, asking only when it can't tell. */
async function resolveNewAppDir(directory, yes) {
  if (directory) return path.resolve(directory)
  if (isEmpty(process.cwd())) return process.cwd()

  const name = yes
    ? "my-chat"
    : exitIfCancelled(
        await p.text({
          message: "What should the app be called?",
          placeholder: "my-chat",
          defaultValue: "my-chat",
        })
      )
  return path.resolve(name)
}

async function createApp(targetDir) {
  if (!isEmpty(targetDir)) {
    throw new CommandError(
      `${path.relative(process.cwd(), targetDir) || "This folder"} isn't empty. Pick a new folder name, or run this inside an existing project to add the chat to it.`
    )
  }

  const manager = managerFromUserAgent()
  const spinner = p.spinner()

  spinner.start("Copying the starter app")
  fs.cpSync(TEMPLATE_DIR, targetDir, { recursive: true })
  // npm drops .gitignore files from published packages, so the template ships
  // it under another name and it gets its real one here.
  fs.renameSync(
    path.join(targetDir, "_gitignore"),
    path.join(targetDir, ".gitignore")
  )
  const pkgFile = path.join(targetDir, "package.json")
  const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"))
  pkg.name = packageName(targetDir)
  fs.writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`)
  ensureRegistry(targetDir, { replace: true })
  spinner.stop("Copied the starter app")

  spinner.start(`Installing packages with ${manager}`)
  await run(manager, ["install"], targetDir)
  spinner.stop("Installed packages")

  // The theme and the chat come from the live registry rather than from this
  // package, so every new app gets whatever the site has deployed.
  spinner.start("Adding the aiellie theme and the chat")
  await shadcn(
    manager,
    ["add", "@aiellie/theme", "@aiellie/chat", "--yes", "--overwrite"],
    targetDir
  )
  spinner.stop("Added the aiellie theme and the chat")

  const relative = path.relative(process.cwd(), targetDir)
  const steps = [
    relative ? `cd ${relative}` : null,
    `${manager} run dev`,
  ].filter(Boolean)
  p.note(steps.join("\n"), "Next")
  p.outro(
    "Replies are simulated until you connect a model. The README says where."
  )
}

async function addChatToProject(projectDir, { yes, overwrite }) {
  const manager = managerForProject(projectDir)

  if (!fs.existsSync(path.join(projectDir, "components.json"))) {
    p.log.step("Setting up shadcn first")
    await shadcn(
      manager,
      yes ? ["init", "--defaults", "--yes"] : ["init"],
      projectDir,
      { quiet: false, unattended: yes }
    )
  }

  ensureRegistry(projectDir)
  p.log.step("Adding the chat")
  await shadcn(
    manager,
    ["add", "@aiellie/chat", "--yes", ...(overwrite ? ["--overwrite"] : [])],
    projectDir,
    { quiet: false, unattended: yes }
  )

  p.outro(
    overwrite
      ? "Added the chat. In a Next.js app it's at /chat."
      : "Added the chat. In a Next.js app it's at /chat. Files you already had were left alone; run again with --overwrite to replace them."
  )
}

async function init(directory, options) {
  p.intro(`aiellie ${version}`)
  const projectDir = directory ? path.resolve(directory) : process.cwd()

  if (fs.existsSync(path.join(projectDir, "package.json"))) {
    await addChatToProject(projectDir, options)
  } else {
    await createApp(await resolveNewAppDir(directory, options.yes))
  }
}

async function add(names, { yes, overwrite }) {
  if (names.length === 0) {
    throw new CommandError(
      "Name at least one item to add, e.g. `npx aiellie add composer`."
    )
  }

  const projectDir = process.cwd()
  if (!fs.existsSync(path.join(projectDir, "components.json"))) {
    throw new CommandError(
      "There's no components.json here. Run `npx aiellie init` first."
    )
  }

  p.intro(`aiellie ${version}`)
  ensureRegistry(projectDir)
  await shadcn(
    managerForProject(projectDir),
    [
      "add",
      ...names.map((name) => `@aiellie/${name}`),
      ...(yes ? ["--yes"] : []),
      ...(overwrite ? ["--overwrite"] : []),
    ],
    projectDir,
    { quiet: false, unattended: yes }
  )
  p.outro("Done.")
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      yes: { type: "boolean", short: "y", default: false },
      overwrite: { type: "boolean", short: "o", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  })

  if (values.version) return console.log(version)

  const [command, ...rest] = positionals
  if (values.help || !command) return console.log(HELP)

  // Without a terminal to answer in, there is nobody to ask, so a piped or CI
  // run takes the defaults instead of waiting on a question forever.
  const options = {
    yes: values.yes || !process.stdin.isTTY,
    overwrite: values.overwrite,
  }

  if (command === "init") return init(rest[0], options)
  if (command === "add") return add(rest, options)

  console.error(`Unknown command "${command}".`)
  console.log(HELP)
  process.exitCode = 1
}

main().catch((error) => {
  if (error instanceof CommandError) {
    p.log.error(error.message)
    if (error.output) console.error(error.output.trim())
  } else {
    p.log.error(error instanceof Error ? error.message : String(error))
  }
  process.exitCode = 1
})
