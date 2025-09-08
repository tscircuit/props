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

  const content =
    `import type { AutocompleteString } from "../common/autocomplete"\n\n` +
    `export type KicadFootprint =\n${typeEntries}\n\n` +
    `export type KicadAutocompleteStringPath = AutocompleteString<\`kicad:\${KicadFootprint}\`>\n`

  const outDir = path.join(__dirname, "../lib/generated")
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, "kicad-autocomplete.ts"), content)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
