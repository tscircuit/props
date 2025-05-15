import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read all TypeScript files in the lib/components directory
function getComponentFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getComponentFiles(fullPath))
    } else if (item.endsWith(".ts") && !item.includes("index.ts")) {
      files.push(fullPath)
    }
  }

  return files
}

// Extract component names and their exports from files
function extractComponentInfo(files: string[]): { name: string; props: string; filePath: string; interfaceDefinition: string }[] {
  const components = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const filename = path.basename(file, ".ts")
    const relativePath = path.relative(path.join(__dirname, ".."), file)

    // Convert filename to PascalCase for component name
    const componentName = filename
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    // Find the props interface
    const propsMatch = content.match(/export interface (\w+Props)/)

    if (propsMatch) {
      const propsName = propsMatch[1]

      // Extract the interface definition
      // This regex finds the interface starting with "export interface PropsName" and captures everything until the closing brace
      const interfaceRegex = new RegExp(`export interface ${propsName}[\\s\\S]+?\\n}`, "m")
      const interfaceMatch = content.match(interfaceRegex)
      const interfaceDefinition = interfaceMatch ? interfaceMatch[0] : ""

      components.push({
        name: componentName,
        props: propsName,
        filePath: relativePath,
        interfaceDefinition
      })
    }
  }

  return components
}

// Generate components table in markdown
function generateComponentsTable(components: { name: string; props: string; filePath: string }[]): string {
  const rows = components.map(comp => {
    const githubPath = `https://github.com/tscircuit/props/blob/main/${comp.filePath}`
    return `| \`<${comp.name.toLowerCase()} />\` | [\`${comp.props}\`](${githubPath}) |`
  })

  return `
## Available Components

| Component | Props Interface |
| --------- | -------------- |
${rows.join("\n")}
`
}

// Generate usage examples in markdown
function generateUsageExamples(): string {
  return `
## Usage Examples

\`\`\`tsx
import { resistorProps, type ResistorProps } from "@tscircuit/props"

// Validate component props
const validatedProps = resistorProps.parse({ resistance: "10k" })
// { resistance: 10000 }

// Type safety
const myResistor: ResistorProps = {
  name: "R1",
  resistance: 10000,
  footprint: "0805"
}
\`\`\`
`
}

// Generate interface definitions section
function generateInterfaceDefinitions(components: { name: string; props: string; interfaceDefinition: string }[]): string {
  const interfaceBlocks = components
    .filter(comp => comp.interfaceDefinition) // Filter out any components with empty interface definitions
    .map(comp => `
### ${comp.props}

\`\`\`ts
${comp.interfaceDefinition}
\`\`\`
`)

  return `
## Component Interface Definitions

Below are the TypeScript interface definitions for all component props:

${interfaceBlocks.join("\n")}
`
}

// Main execution
const componentsDir = path.join(__dirname, "../lib/components")
const files = getComponentFiles(componentsDir)
const components = extractComponentInfo(files)

// Sort components alphabetically
components.sort((a, b) => a.name.localeCompare(b.name))

const componentsTable = generateComponentsTable(components)
const usageExamples = generateUsageExamples()
const interfaceDefinitions = generateInterfaceDefinitions(components)

// Read current README
const readmePath = path.join(__dirname, "../README.md")
let readmeContent = fs.readFileSync(readmePath, "utf8")

// Check if there are existing comment markers
if (!readmeContent.includes("<!-- COMPONENT_TABLE_START -->")) {
  // Add the markers if they don't exist
  readmeContent += "\n\n<!-- COMPONENT_TABLE_START -->\n<!-- COMPONENT_TABLE_END -->\n\n"
}

if (!readmeContent.includes("<!-- USAGE_EXAMPLES_START -->")) {
  // Add the markers if they don't exist
  readmeContent += "<!-- USAGE_EXAMPLES_START -->\n<!-- USAGE_EXAMPLES_END -->\n"
}

if (!readmeContent.includes("<!-- INTERFACE_DEFINITIONS_START -->")) {
  // Add the markers if they don't exist
  readmeContent += "\n\n<!-- INTERFACE_DEFINITIONS_START -->\n<!-- INTERFACE_DEFINITIONS_END -->\n"
}

// Replace the content between the markers
readmeContent = readmeContent.replace(
  /<!-- COMPONENT_TABLE_START -->[\s\S]*?<!-- COMPONENT_TABLE_END -->/,
  `<!-- COMPONENT_TABLE_START -->${componentsTable}<!-- COMPONENT_TABLE_END -->`
)

readmeContent = readmeContent.replace(
  /<!-- USAGE_EXAMPLES_START -->[\s\S]*?<!-- USAGE_EXAMPLES_END -->/,
  `<!-- USAGE_EXAMPLES_START -->${usageExamples}<!-- USAGE_EXAMPLES_END -->`
)

readmeContent = readmeContent.replace(
  /<!-- INTERFACE_DEFINITIONS_START -->[\s\S]*?<!-- INTERFACE_DEFINITIONS_END -->/,
  `<!-- INTERFACE_DEFINITIONS_START -->${interfaceDefinitions}<!-- INTERFACE_DEFINITIONS_END -->`
)

// Write back to README
fs.writeFileSync(readmePath, readmeContent)

console.log("README documentation updated successfully!")