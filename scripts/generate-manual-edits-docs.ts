import fs from "node:fs"
import path from "node:path"
import { glob } from "glob"

interface ElementDoc {
  name: string
  description: string
  interface: string
  otherInterfaces: string[]
}

async function generateManualEditsDocs() {
  const pattern = "lib/manual-edits/**/*.ts"
  const files = await glob(pattern, {
    cwd: process.cwd(),
    absolute: true,
  })

  console.log("Found source files:", files)
  const sections = {
    "Manual Edit Events": [] as ElementDoc[],
    "Manual Edit Files": [] as ElementDoc[],
  }

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const basename = path.basename(file, ".ts")

    // Determine section based on file path and content
    let section = "Manual Edit Files"
    if (
      file.includes("manual-edit-events") ||
      basename.includes("edit_event") ||
      content.includes("EditEvent") ||
      content.includes("ManualEditEvent")
    ) {
      section = "Manual Edit Events"
    }
    // Convert filename to expected interface name
    const expectedNames = [
      // Convert snake_case to PascalCase
      basename
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(""),
      // Handle special event cases
      basename.replace(/_event$/, "Event"),
      basename.replace(/_/g, "").replace(/event$/, "Event"),
      // Direct matches for known interfaces
      "EditPcbComponentLocationEvent",
      "EditTraceHintEvent",
      "EditSchematicComponentLocationEvent",
      "BaseManualEditEvent",
      "ManualEditsFile",
      "ManualPcbPlacement",
      "ManualSchematicPlacement",
      "ManualTraceHint",
    ]

    const exportBlocks: string[] = []

    // Match export interface declarations with proper multiline handling
    // Match export interface declarations with proper multiline handling
    const interfaceMatches =
      content.match(
        /(?:\/\*\*[\s\S]*?\*\/\s*)?export\s+interface\s+([A-Z][a-zA-Z0-9]*)(?:\s+extends\s+[A-Za-z0-9._]+)?\s*{[\s\S]*?(?:^}|\n\s*})/gm,
      ) ?? []

    // Debug logging for interface detection
    console.log(`[${basename}] Searching for interfaces...`)
    console.log(
      content.match(/export\s+interface\s+([A-Z][a-zA-Z0-9]*)/g) ?? [],
    )
    if (interfaceMatches.length > 0) {
      console.log(`Found interfaces in ${basename}:`, interfaceMatches)
    }
    exportBlocks.push(...interfaceMatches)

    // Match export type declarations (excluding Zod types)
    // Match export type declarations (excluding input/infer types)
    // Match export type declarations (excluding input/infer types)
    const typeMatches =
      content.match(
        /(?:\/\*\*[\s\S]*?\*\/\s*)?export\s+type\s+([A-Z][a-zA-Z0-9]*)(?!\s*=\s*(?:z\.|.*Input|.*infer))[^;]*;/gm,
      ) ?? []

    // Debug logging for type detection
    console.log(`[${basename}] Searching for types...`)
    console.log(content.match(/export\s+type\s+([A-Z][a-zA-Z0-9]*)/g) ?? [])
    if (typeMatches.length > 0) {
      console.log(`Found types in ${basename}:`, typeMatches)
    }
    exportBlocks.push(...typeMatches)

    // Process all export blocks
    for (const block of exportBlocks) {
      // Skip input/infer types and deprecated interfaces
      if (
        block.includes("Input") ||
        block.includes("infer") ||
        (block.includes("@deprecated") && !block.includes("/** @deprecated */"))
      ) {
        continue
      }

      // Extract interface/type name
      const nameMatch = block.match(
        /export\s+(?:interface|type)\s+([A-Z][a-zA-Z0-9]*)/,
      )
      if (!nameMatch) continue
      const interfaceName = nameMatch[1]

      // Clean up the block
      let cleaned = block
        // Remove export keyword
        .replace(/export\s+(interface|type)\s+/, "$1 ")
        // Clean up JSDoc comments
        .replace(/\/\*\*\s*\n\s*\*\s*/g, "/** ")
        .replace(/\n\s*\*\//g, " */")
        // Clean up whitespace
        .replace(/{\n\s*([^}]*)\n\s*}/g, (_, content) => {
          const lines = content.trim().split("\n")
          const formattedLines = lines.map((line) => `  ${line.trim()}`)
          return `{\n${formattedLines.join("\n")}\n}`
        })
        // Fix spacing
        .replace(/\s+extends\s+/g, " extends ")
        .replace(/(\s*):(\s*)/g, ": ")
        .replace(/(\s*)\?:(\s*)/g, "?: ")
        .replace(/\n\s*\n/g, "\n")
        .trim()

      // Extract description from JSDoc
      const descMatch = block.match(/\/\*\*\s*(.*?)\s*\*\//)
      const description = descMatch ? descMatch[1] : ""

      // Add to appropriate section
      sections[section].push({
        name: interfaceName,
        description,
        interface: cleaned,
        otherInterfaces: [],
      })
    }
  }

  let toc = ""
  let docs = ""

  // Generate Table of Contents
  toc += "# Manual Edits Documentation\n\n"
  toc += "## Table of Contents\n\n"

  toc += "- [Manual Edit Events](#manual-edit-events)\n"
  for (const elem of sections["Manual Edit Events"].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `  - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  toc += "- [Manual Edit Files](#manual-edit-files)\n"
  for (const elem of sections["Manual Edit Files"].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    toc += `  - [${elem.name}](#${elem.name.toLowerCase()})\n`
  }

  // Generate Documentation Sections
  docs += "## Manual Edit Events\n\n"
  docs += "Events that represent manual edits to the circuit.\n\n"
  for (const elem of sections["Manual Edit Events"].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    docs += `### ${elem.name}\n\n`
    if (elem.description) {
      docs += `${elem.description}\n\n`
    }
    docs += "```typescript\n"
    docs += elem.interface
    if (elem.otherInterfaces.length > 0) {
      docs += `\n\n${elem.otherInterfaces.join("\n\n")}`
    }
    docs += "\n```\n\n"
  }

  docs += "## Manual Edit Files\n\n"
  docs += "File structures that store manual edits.\n\n"
  for (const elem of sections["Manual Edit Files"].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    docs += `### ${elem.name}\n\n`
    if (elem.description) {
      docs += `${elem.description}\n\n`
    }
    docs += "```typescript\n"
    docs += elem.interface
    if (elem.otherInterfaces.length > 0) {
      docs += `\n\n${elem.otherInterfaces.join("\n\n")}`
    }
    docs += "\n```\n\n"
  }

  // Create docs directory if it doesn't exist
  const docsDir = path.join(process.cwd(), "docs")
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir)
  }

  // Write the documentation file
  const output = toc + "\n" + docs
  fs.writeFileSync(
    path.join(process.cwd(), "docs", "manual-edits.generated.md"),
    output,
  )
}

generateManualEditsDocs()
