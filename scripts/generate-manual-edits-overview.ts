import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read all TypeScript files in the lib directory recursively
function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllTypeScriptFiles(fullPath))
    } else if (item.endsWith(".ts")) {
      files.push(fullPath)
    }
  }

  return files
}

// Extract exported interfaces from file content
function extractManualEditInterfaces(content: string): string[] {
  const interfaces: string[] = []
  const lines = content.split("\n")
  let currentInterface = ""
  let isCapturing = false
  let bracketCount = 0

  for (const line of lines) {
    // Start capturing on export interface that's not deprecated
    if (
      line.match(/export\s+interface\s+.*/) &&
      !line.includes("@deprecated")
    ) {
      isCapturing = true
      currentInterface = `${line}\n`
      bracketCount = line.split("{").length - 1
    } else if (isCapturing) {
      currentInterface += `${line}\n`

      // Count brackets to handle nested interfaces
      bracketCount += (line.match(/{/g) || []).length
      bracketCount -= (line.match(/}/g) || []).length

      if (bracketCount === 0) {
        interfaces.push(currentInterface)
        isCapturing = false
        currentInterface = ""
      }
    }
  }

  return interfaces
}

// Main execution
const libDir = path.join(__dirname, "../lib/manual-edits")
const files = getAllTypeScriptFiles(libDir)

const allInterfaces = files.flatMap((file) => {
  const content = fs.readFileSync(file, "utf8")
  return extractManualEditInterfaces(content)
})

// Generate markdown content
const template = `# Manual Edits Overview

> Generated at ${new Date().toISOString()}
> This document provides an overview of manual edit types and interfaces in @tscircuit/props.

## Overview

This document describes the interfaces used for manual edits in the circuit editor. Manual edits
are used to track user modifications to the circuit, such as:

- Moving PCB components
- Moving schematic components
- Adding trace hints for routing

Each manual edit is represented by a specific event type that extends the base \`ManualEditEvent\`
interface. These events are stored in a \`ManualEditsFile\` which can be used to replay or
persist user modifications.

For validation, each interface has a corresponding zod validator that can be imported from the package.

For example:

\`\`\`ts
import { manual_edits_file, type ManualEditsFile } from "@tscircuit/props"

// Validate/parse a manual edits file
const validatedFile = manual_edits_file.parse(unknownFile)
\`\`\`

## Available Interfaces

\`\`\`ts
${allInterfaces.join("\n\n")}
\`\`\`

## Circuit JSON Integration

The manual edit events integrate with the circuit-json format. For example, the \`EditTraceHintEvent\`
uses the \`route_hint_point\` type from circuit-json for defining trace routes.

For more details on the circuit-json format, see:
https://github.com/tscircuit/circuit-json
`

// Write to generated directory
const generatedDir = path.join(__dirname, "../generated")
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir)
}

fs.writeFileSync(path.join(generatedDir, "manual-edits.md"), template)

console.log("Generated manual-edits.md successfully.")
