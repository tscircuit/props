import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const res = await fetch(
    "https://kicad-mod-cache.tscircuit.com/kicad_files.json",
  )
  if (!res.ok) throw new Error(`Failed to fetch kicad files: ${res.status}`)
  const files: string[] = await res.json()

  const sanitizedFiles = Array.from(
    new Set(
      files.map((p) => p.replace(/\.kicad_mod$/, "").replace(/\.pretty/g, "")),
    ),
  )

  const typeEntries = sanitizedFiles.map((p) => `  | "${p}"`).join("\n")

  const footprintStringEntries = sanitizedFiles
    .map((p) => `  "${p}": "kicad:${p}"`)
    .join(",\n")

  const autocompleteContent = `import type { AutocompleteString } from "../common/autocomplete"\n\nexport type KicadPath = ${typeEntries}\n\nexport type KicadAutocompleteStringPath = AutocompleteString<\n\`kicad:\${KicadPath}\`\n>\n`

  const footprintStringsContent = `import type { KicadPath } from "./kicad-autocomplete"\n\nexport const kicadFootprintStrings: Record<KicadPath, \`kicad:\${KicadPath}\`> = {\n${footprintStringEntries},\n}\n`

  const outDir = path.join(__dirname, "../lib/generated")
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, "kicad-autocomplete.ts"),
    autocompleteContent,
  )
  fs.writeFileSync(
    path.join(outDir, "kicad-footprint-strings.ts"),
    footprintStringsContent,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
