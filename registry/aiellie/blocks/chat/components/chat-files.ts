"use client"

import type { FileUIPart, TextUIPart, UIMessage } from "ai"

import {
  formatSize,
  isText,
} from "@/registry/aiellie/blocks/chat/components/chat-attachment-dialog"
import type { ChatAttachment } from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"

type AttachmentPart = FileUIPart | TextUIPart
type Budget = { bytes: number; text: number }

// Hosts cap a request's body (Vercel at 4.5 MB), and every request carries the
// whole chat, so the chat's attachments share this much, newest first.
const REQUEST_BYTES = 4 * 1024 * 1024
// About 100k tokens of files read in as text, across the chat.
const REQUEST_TEXT = 400_000
const FILE_TEXT = 100_000
// Models scale a longer image down to about this, so more only costs upload.
const IMAGE_EDGE = 1568
const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
])
// Picked along with a folder, but never worth a model's reading.
const SKIPPED_FOLDERS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "out",
])

function readDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, IMAGE_EDGE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && IMAGE_TYPES.has(file.type) && file.size <= 1_000_000) {
    bitmap.close()
    return file
  }
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  // WebP keeps transparency. A browser that can't write it hands back a PNG.
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  )
  if (!blob) throw new Error("The image couldn't be encoded.")
  return blob
}

function nameOf(file: File) {
  return file.webkitRelativePath || file.name
}

async function readPart(file: File): Promise<AttachmentPart | null> {
  const name = nameOf(file)
  try {
    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      const image = await shrinkImage(file)
      return {
        type: "file",
        mediaType: image.type,
        filename: name,
        url: await readDataUrl(image),
      }
    }
    if (file.type === "application/pdf") {
      return {
        type: "file",
        mediaType: file.type,
        filename: name,
        url: await readDataUrl(file),
      }
    }
    if (isText(file)) {
      const text = await file.slice(0, FILE_TEXT).text()
      const cut =
        file.size > FILE_TEXT
          ? `\n[Cut off after the first ${formatSize(FILE_TEXT)} of ${formatSize(file.size)}.]`
          : ""
      return {
        type: "text",
        text: `<file name="${name}">\n${text}${cut}\n</file>`,
      }
    }
  } catch {
    // A format this browser can't decode, like HEIC outside Safari.
  }
  return null
}

// Read once per file, since every later message sends it again.
const cache = new WeakMap<File, Promise<AttachmentPart | null>>()

function partOf(file: File) {
  let part = cache.get(file)
  if (!part) {
    part = readPart(file)
    cache.set(file, part)
  }
  return part
}

// Skips what's plainly over the budget before reading it, since reading a
// large file only to drop it would hold up the reply.
function fits(file: File, budget: Budget) {
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    return budget.bytes > 0
  }
  if (file.type === "application/pdf") return file.size * 1.34 <= budget.bytes
  return budget.text > 0 && budget.bytes > 0
}

async function readAttachments(attachments: ChatAttachment[], budget: Budget) {
  const parts: AttachmentPart[] = []
  const unreadable: string[] = []
  const leftOut: string[] = []
  // A single file left out is worth stopping for. A folder only too big to
  // send whole still sends what fits.
  const tooLarge: string[] = []

  for (const attachment of attachments) {
    const folder = attachment.kind === "folder"
    const files = folder
      ? attachment.files.filter(
          (file) =>
            !nameOf(file)
              .split("/")
              .some((segment) => SKIPPED_FOLDERS.has(segment))
        )
      : attachment.files

    for (const file of files) {
      const name = nameOf(file)
      const part = fits(file, budget) ? await partOf(file) : undefined
      const cost = !part
        ? 0
        : part.type === "text"
          ? part.text.length
          : part.url.length
      if (part === null) {
        unreadable.push(name)
      } else if (
        !part ||
        cost > budget.bytes ||
        (part.type === "text" && cost > budget.text)
      ) {
        leftOut.push(name)
        if (!folder) tooLarge.push(name)
      } else {
        budget.bytes -= cost
        if (part.type === "text") budget.text -= cost
        parts.push(part)
      }
    }
  }

  return { parts, unreadable, leftOut, tooLarge }
}

function list(names: string[]) {
  const shown = names.slice(0, 12).join(", ")
  return names.length > 12 ? `${shown}, and ${names.length - 12} more` : shown
}

// Built newest first, so the message being answered gets its files in ahead
// of older ones. What can't be sent is named, so the model knows it's there.
async function toUIMessages(messages: ChatMessage[]) {
  const budget: Budget = { bytes: REQUEST_BYTES, text: REQUEST_TEXT }
  const newest = messages.findLastIndex((message) => message.role === "user")
  const built: UIMessage[] = []
  let tooLarge: string[] = []

  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index]
    if (message.status === "failed") continue
    budget.bytes -= message.content.length

    const read = await readAttachments(message.attachments ?? [], budget)
    if (index === newest) tooLarge = read.tooLarge
    const text = [
      message.content,
      read.unreadable.length > 0 &&
        `Attached, but in a form that can't be read here: ${list(read.unreadable)}.`,
      read.leftOut.length > 0 &&
        `Attached, but left out to keep the request small: ${list(read.leftOut)}.`,
    ]
      .filter(Boolean)
      .join("\n\n")

    // Files ahead of the words about them, which models read best.
    const parts: UIMessage["parts"] = [
      ...read.parts,
      ...(text ? [{ type: "text" as const, text }] : []),
    ]
    if (parts.length > 0) {
      built.unshift({ id: message.id, role: message.role, parts })
    }
  }

  if (tooLarge.length > 0) {
    throw new Error(
      `Too large to send: ${list(tooLarge)}. Attachments can come to ${formatSize(REQUEST_BYTES)} in all.`
    )
  }
  return built
}

export { toUIMessages }
