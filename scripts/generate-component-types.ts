import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function extractInterfaces(content) {
  const interfaces = []
  const lines = content.split("\n")
  let currentInterface = ""
  let isCapturing = false
  let captureComments = ""
  let bracketCount = 0

  for (const line of lines) {
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

    if (
      (line.includes("export interface") ||
        line.includes("export type") ||
        line.match(/export\s+(const|let|var)\s+\w+\s*=/)) &&
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

      if (
        (bracketCount === 0 && line.includes("}")) ||
        line.trim().endsWith(";") ||
        (line.includes(" as const") && line.includes("]")) ||
        (bracketCount === 0 &&
          !line.trim().endsWith(",") &&
          !line.trim().endsWith("{"))
      ) {
        interfaces.push(`${currentInterface.trim()}\n`)
        isCapturing = false
        currentInterface = ""
        bracketCount = 0
      }
    }
  }

  // Extract inner properties using regex
  const propertyRegex = /([a-zA-Z0-9_]+)\s*:\s*[^,}]+/g
  const properties = content.match(propertyRegex)

  if (properties) {
    properties.forEach((prop) => {
      if (!interfaces.includes(prop)) {
        interfaces.push(`${prop}\n`)
      }
    })
  }

  return interfaces
}

function generateComponentTypesDoc() {
  const libDir = path.join(__dirname, "../lib")
  const commonDir = path.join(libDir, "common")
  const componentsDir = path.join(libDir, "components")

  const commonFiles = fs
    .readdirSync(commonDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(commonDir, file))

  const componentFiles = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => path.join(componentsDir, file))

  let markdown = `# TSCircuit Component Types\n\n## Common Types\n\n`

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

  const generatedDir = path.join(__dirname, "../generated")
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir)
  }

  fs.writeFileSync(path.join(generatedDir, "COMPONENT_TYPES.md"), markdown)
}

generateComponentTypesDoc()
