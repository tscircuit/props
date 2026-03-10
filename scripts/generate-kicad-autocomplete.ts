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

  const keyEntries = sanitizedFiles.map((p) => `  "${p}"`).join(",\n")

  const autocompleteContent = `import type { AutocompleteString } from "../common/autocomplete"\n\nexport const kicadFootprintKeys = [\n${keyEntries},\n] as const\n\nexport type KicadPath = typeof kicadFootprintKeys[number]\n\nexport type KicadAutocompleteStringPath = AutocompleteString<\`kicad:\${KicadPath}\`>\n`

  const footprintStringsContent = `import { kicadFootprintKeys } from "./kicad-autocomplete"\nimport type { KicadPath } from "./kicad-autocomplete"\n\nexport const kicadFootprintStrings = Object.fromEntries(\n  kicadFootprintKeys.map((key) => [key, \`kicad:\${key}\`]),\n) as Record<KicadPath, \`kicad:\${KicadPath}\`>\n`

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
