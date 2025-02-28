import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function extractInterfaces(content: string): string[] {
  const interfaces: string[] = []
  const lines = content.split("\n")
  let currentInterface = ""
  let isCapturing = false
  let captureComments = ""
  let bracketCount = 0

  for (const line of lines) {
    // Capture JSDoc comments
    if (line.trim().startsWith("/**")) {
      captureComments = `${line}\n`
      continue
    }
    if (captureComments && line.trim().startsWith("*")) {
      captureComments += `${line}\n`
      if (line.trim() === "*/") {
        continue
      }
      continue
    }

    // Capture all exports except Input/Inferred types
    if (
      (line.includes("export interface") ||
        line.includes("export type") ||
        line.match(/export\s+(const|let|var)\s+\w+\s*=/) ||
        line.includes(".extend(")) && // Capture extended properties
      !line.includes("@deprecated") &&
      !line.includes("Input") &&
      !line.includes("Inferred")
    ) {
      isCapturing = true
      currentInterface = `${captureComments}${line}\n`
      captureComments = ""
      bracketCount += (line.match(/{/g) || []).length
      bracketCount -= (line.match(/}/g) || []).length
    } else if (isCapturing) {
      currentInterface += `${line}\n`
      bracketCount += (line.match(/{/g) || []).length
      bracketCount -= (line.match(/}/g) || []).length

      // End capture based on context
      if (
        (bracketCount === 0 && line.includes("}")) || // Interface/type end
        line.trim().endsWith(";") || // Simple type end
        (line.includes(" as const") && line.includes("]")) // Const array end
      ) {
        interfaces.push(`${currentInterface.trim()}\n`)
        isCapturing = false
        currentInterface = ""
        bracketCount = 0
      }
    }
  }

  return interfaces
}

function generateComponentTypesDoc() {
  const libDir = path.join(__dirname, "../lib")
  const commonDir = path.join(libDir, "common")
  const componentsDir = path.join(libDir, "components")

  // Get common types first
  const commonFiles = fs
    .readdirSync(commonDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(commonDir, file))

  // Then get component types
  const componentFiles = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(componentsDir, file))

  let markdown = `# TSCircuit Component Types

## Common Types

`
  // Add common types
  for (const file of commonFiles) {
    const content = fs.readFileSync(file, "utf8")
    const interfaces = extractInterfaces(content)

    if (interfaces.length > 0) {
      const typeName = path.basename(file, ".ts")
      markdown += `### ${typeName}\n\n`
      markdown += "```typescript\n"
      markdown += interfaces.join("")
      markdown += "```\n\n"
    }
  }

  markdown += "## Available Component Types\n\n"

  // Process component files
  for (const file of componentFiles) {
    const content = fs.readFileSync(file, "utf8")
    const interfaces = extractInterfaces(content)

    if (interfaces.length > 0) {
      const componentName = path.basename(file, ".ts")
      markdown += `### ${componentName}\n\n`
      markdown += "```typescript\n"
      markdown += interfaces.join("")
      markdown += "```\n\n"
    }
  }

  // Create generated directory if it doesn't exist
  const generatedDir = path.join(__dirname, "../generated")
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir)
  }

  const formattedMarkdown = markdown.replace(
    /\)\s*\n\s*\.extend\(/g,
    ")\n  .extend(",
  )
  fs.writeFileSync(
    path.join(generatedDir, "COMPONENT_TYPES.md"),
    formattedMarkdown,
  )
}

generateComponentTypesDoc()
