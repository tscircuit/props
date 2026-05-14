import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const JLCSEARCH_API = "https://jlcsearch.tscircuit.com/api/search"
const limit = Number(process.env.JLCPCB_AUTOCOMPLETE_LIMIT ?? "50000")
const maxRetries = Number(process.env.JLCPCB_AUTOCOMPLETE_MAX_RETRIES ?? "5")

type JlcsearchResponse = {
  components?: Array<{
    lcsc?: number
  }>
}

function formatKnownPartNumbers(knownPartNumbers: string[]) {
  return knownPartNumbers.map((partNumber) => `  | "${partNumber}"`).join("\n")
}

function generateAutocompleteContent(knownPartNumbers: string[]) {
  const knownPartNumberEntries = formatKnownPartNumbers(knownPartNumbers)

  return `import type { AutocompleteString } from "../common/autocomplete"

/**
 * Generated from the public jlcsearch in-stock API.
 * Source: ${JLCSEARCH_API}?limit=${limit}
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
      const knownPartNumbers = Array.from(
        new Set(
          (json.components ?? [])
            .map((component) => component.lcsc)
            .filter((lcsc): lcsc is number => Number.isInteger(lcsc))
            .map((lcsc) => `C${lcsc}`),
        ),
      ).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))

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
