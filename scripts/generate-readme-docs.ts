import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read all TypeScript files in the lib/components directory
function getComponentFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir).sort()

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
function extractComponentInfo(files: string[]): {
  name: string
  props: string
  filePath: string
  interfaceDefinition: string
}[] {
  const components = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const filename = path.basename(file, ".ts")
    const relativePath = path.relative(path.join(__dirname, ".."), file)

    // Convert filename to PascalCase for component name
    const componentName = filename
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

    // Find the props interface
    const propsMatch = content.match(/export interface (\w+Props)/)

    if (propsMatch) {
      const propsName = propsMatch[1]

      // Extract the interface definition
      // This regex finds the interface starting with "export interface PropsName" and captures everything until the closing brace
      const interfaceRegex = new RegExp(
        `export interface ${propsName}[\\s\\S]+?\\n}`,
        "m",
      )
      const interfaceMatch = content.match(interfaceRegex)
      const interfaceDefinition = interfaceMatch ? interfaceMatch[0] : ""

      components.push({
        name: componentName,
        props: propsName,
        filePath: relativePath,
        interfaceDefinition,
      })
    }
  }

  return components
}

// Generate components table in markdown
function generateComponentsTable(
  components: {
    name: string
    props: string
    filePath: string
    interfaceDefinition: string
  }[],
): string {
  const rows = components.map((comp) => {
    // Link to the section in the document instead of GitHub
    const sectionLink = `#${comp.props.toLowerCase()}-${comp.name.toLowerCase()}`
    return `| \`<${comp.name.toLowerCase()} />\` | [\`${comp.props}\`](${sectionLink}) |`
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
function generateInterfaceDefinitions(
  components: {
    name: string
    props: string
    filePath: string
    interfaceDefinition: string
  }[],
): string {
  // Add CommonComponentProps and SubcircuitGroupProps
  const priorityInterfaces = [
    {
      name: "Common",
      props: "CommonComponentProps",
      interfaceDefinition: `export interface CommonComponentProps extends CommonLayoutProps {
  key?: any
  name: string
  pinAttributes?: Record<PinLabel, PinAttributeMap>
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
  doNotPlace?: boolean
}`,
      filePath: "lib/common/layout.ts",
    },
    {
      name: "Group",
      props: "SubcircuitGroupProps",
      interfaceDefinition: `export interface SubcircuitGroupProps extends BaseGroupProps {
  layout?: LayoutBuilder
  manualEdits?: ManualEditsFileInput
  routingDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance
  pcbRouteCache?: PcbRouteCache

  autorouter?: AutorouterProp

  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean

  /**
   * If true, net labels will automatically be created for complex traces
   */
  schTraceAutoLabelEnabled?: boolean

  partsEngine?: PartsEngine
}`,
      filePath: "lib/components/group.ts",
    },
  ]

  // Combine priority interfaces with component interfaces
  const allComponents = [
    ...priorityInterfaces,
    ...components.filter((comp) => comp.interfaceDefinition),
  ]

  const interfaceBlocks = allComponents.map((comp) => {
    const githubPath = `https://github.com/tscircuit/props/blob/main/${comp.filePath}`
    const componentHeader =
      comp.name !== "Common" && comp.name !== "Group"
        ? ` \`<${comp.name.toLowerCase()} />\``
        : ""

    return `
### ${comp.props}${componentHeader}

\`\`\`ts
${comp.interfaceDefinition}
\`\`\`

[Source](${githubPath})
`
  })

  return `
## Component Interface Definitions

Below are the TypeScript interface definitions for all component props:

${interfaceBlocks.join("\n")}
`
}

function generatePlatformConfigSection(): string {
  const platformConfigPath = path.join(__dirname, "../lib/platformConfig.ts")
  const content = fs.readFileSync(platformConfigPath, "utf8")
  const interfaceMatch = content.match(
    /export interface PlatformConfig[\s\S]+?\n}/,
  )
  const interfaceDefinition = interfaceMatch ? interfaceMatch[0] : ""
  const githubPath =
    "https://github.com/tscircuit/props/blob/main/lib/platformConfig.ts"

  return `
## tscircuit Platform Configuration

### PlatformConfig

\`\`\`ts
${interfaceDefinition}
\`\`\`

[Source](${githubPath})
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
const platformConfigSection = generatePlatformConfigSection()

// Read current README
const readmePath = path.join(__dirname, "../README.md")
let readmeContent = fs.readFileSync(readmePath, "utf8")

// Check if there are existing comment markers
if (!readmeContent.includes("<!-- COMPONENT_TABLE_START -->")) {
  // Add the markers if they don't exist
  readmeContent +=
    "\n\n<!-- COMPONENT_TABLE_START -->\n<!-- COMPONENT_TABLE_END -->\n\n"
}

if (!readmeContent.includes("<!-- USAGE_EXAMPLES_START -->")) {
  // Add the markers if they don't exist
  readmeContent +=
    "<!-- USAGE_EXAMPLES_START -->\n<!-- USAGE_EXAMPLES_END -->\n"
}

if (!readmeContent.includes("<!-- INTERFACE_DEFINITIONS_START -->")) {
  // Add the markers if they don't exist
  readmeContent +=
    "\n\n<!-- INTERFACE_DEFINITIONS_START -->\n<!-- INTERFACE_DEFINITIONS_END -->\n"
}

if (!readmeContent.includes("<!-- PLATFORM_CONFIG_START -->")) {
  readmeContent +=
    "\n\n<!-- PLATFORM_CONFIG_START -->\n<!-- PLATFORM_CONFIG_END -->\n"
}

// Replace the content between the markers
readmeContent = readmeContent.replace(
  /<!-- COMPONENT_TABLE_START -->[\s\S]*?<!-- COMPONENT_TABLE_END -->/,
  `<!-- COMPONENT_TABLE_START -->${componentsTable}<!-- COMPONENT_TABLE_END -->`,
)

readmeContent = readmeContent.replace(
  /<!-- USAGE_EXAMPLES_START -->[\s\S]*?<!-- USAGE_EXAMPLES_END -->/,
  `<!-- USAGE_EXAMPLES_START -->${usageExamples}<!-- USAGE_EXAMPLES_END -->`,
)

readmeContent = readmeContent.replace(
  /<!-- INTERFACE_DEFINITIONS_START -->[\s\S]*?<!-- INTERFACE_DEFINITIONS_END -->/,
  `<!-- INTERFACE_DEFINITIONS_START -->${interfaceDefinitions}<!-- INTERFACE_DEFINITIONS_END -->`,
)

readmeContent = readmeContent.replace(
  /<!-- PLATFORM_CONFIG_START -->[\s\S]*?<!-- PLATFORM_CONFIG_END -->/,
  `<!-- PLATFORM_CONFIG_START -->${platformConfigSection}<!-- PLATFORM_CONFIG_END -->`,
)

// Write back to README
fs.writeFileSync(readmePath, readmeContent)

console.log("README documentation updated successfully!")
