import type { CommonComponentProps } from "./layout"

/**
 * Schemas retain the author's optional aliases so their Zod objects remain
 * composable. Consumers resolve them to a canonical manufacturer part number
 * with this helper. There is no default: empty/whitespace-only values are absent.
 * Equal aliases are accepted; conflicting nonempty aliases throw. Existing
 * manufacturerPartNumber and mfn inputs remain supported without migration.
 */
export const resolveManufacturerPartNumber = (
  props: Pick<CommonComponentProps, "manufacturerPartNumber" | "mpn" | "mfn">,
): string | undefined => {
  const partNumbers = [props.manufacturerPartNumber, props.mpn, props.mfn]
    .map((partNumber) => partNumber?.trim())
    .filter((partNumber): partNumber is string => Boolean(partNumber))

  if (new Set(partNumbers).size > 1) {
    throw new Error(
      "Conflicting manufacturerPartNumber, mpn, and mfn: specify the same manufacturer part number for all aliases",
    )
  }
  return partNumbers[0]
}
