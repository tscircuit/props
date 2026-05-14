import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const JLCSEARCH_API = "https://jlcsearch.tscircuit.com/api/search"
const limit = Number(process.env.JLCPCB_AUTOCOMPLETE_LIMIT ?? "50000")
const minStock = Number(process.env.JLCPCB_AUTOCOMPLETE_MIN_STOCK ?? "50000")
const maxRetries = Number(process.env.JLCPCB_AUTOCOMPLETE_MAX_RETRIES ?? "5")

type JlcsearchResponse = {
  components?: Array<{
    lcsc?: number
    package?: string
    stock?: number
  }>
}

function formatKnownPartNumbers(knownPartNumbers: string[]) {
  return knownPartNumbers.map((partNumber) => `  | "${partNumber}"`).join("\n")
}

function isPassiveLikePackage(packageName: string | undefined) {
  const normalizedPackageName = packageName?.trim().toUpperCase() ?? ""

  return (
    /^\d{4}(X\d+)?$/.test(normalizedPackageName) ||
    /^CASE-[A-Z0-9-]+(\(MM\))?$/.test(normalizedPackageName) ||
    /^SMD,D[\d.]+XL[\d.]+MM$/.test(normalizedPackageName) ||
    /^SMD\d{4}-\d+P$/.test(normalizedPackageName)
  )
}

function generateAutocompleteContent(knownPartNumbers: string[]) {
  const knownPartNumberEntries = formatKnownPartNumbers(knownPartNumbers)

  return `import type { AutocompleteString } from "../common/autocomplete"

/**
 * Generated from the public jlcsearch in-stock API.
 * Source: ${JLCSEARCH_API}?limit=${limit}
 * Filter: stock >= ${minStock}
 * Excludes: common passive package shapes (chip passives, arrays, can caps, tantalum cases)
 * Ordering: source order (jlcsearch sorts by stock descending)
 * Generated at: ${new Date().toISOString()}
 * Known part numbers: ${knownPartNumbers.length}
 */
export type JlcpcbKnownPartNumber =
${knownPartNumberEntries}

export type JlcpcbAutocompleteStringPath = AutocompleteString<
  \`jlcpcb:\${JlcpcbKnownPartNumber}\` | \`jlcpcb:C\${number}\`
>
`
}

async function fetchKnownPartNumbers() {
  const url = new URL(JLCSEARCH_API)
  url.searchParams.set("limit", String(limit))

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      })

      if (!res.ok) {
        throw new Error(`Unexpected response status: ${res.status}`)
      }

      const json = (await res.json()) as JlcsearchResponse
      const knownPartNumbers: string[] = []
      const seenPartNumbers = new Set<string>()

      for (const component of json.components ?? []) {
        const lcsc = component.lcsc
        const packageName = component.package
        const stock = component.stock ?? 0

        if (!Number.isInteger(lcsc) || stock < minStock) continue
        if (isPassiveLikePackage(packageName)) continue

        const partNumber = `C${lcsc}`
        if (seenPartNumbers.has(partNumber)) continue

        seenPartNumbers.add(partNumber)
        knownPartNumbers.push(partNumber)
      }

      return knownPartNumbers
    } catch (error) {
      if (attempt >= maxRetries) throw error

      const retryDelayMs = 500 * 2 ** attempt
      console.warn(
        `Failed to fetch JLC autocomplete dataset, retrying in ${retryDelayMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
      )
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
    }
  }

  throw new Error("Failed to fetch JLC autocomplete dataset")
}

async function main() {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`Invalid JLCPCB_AUTOCOMPLETE_LIMIT: ${limit}`)
  }
  if (!Number.isInteger(minStock) || minStock < 0) {
    throw new Error(`Invalid JLCPCB_AUTOCOMPLETE_MIN_STOCK: ${minStock}`)
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new Error(`Invalid JLCPCB_AUTOCOMPLETE_MAX_RETRIES: ${maxRetries}`)
  }

  const knownPartNumbers = await fetchKnownPartNumbers()
  const autocompleteContent = generateAutocompleteContent(knownPartNumbers)

  const outDir = path.join(__dirname, "../lib/generated")
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, "jlcpcb-autocomplete.ts"),
    autocompleteContent,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
