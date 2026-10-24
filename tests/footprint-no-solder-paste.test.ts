import { expect, test } from "bun:test"
import {
  footprintProps,
  type FootprintProps,
} from "../lib/components/footprint"

test("a footprint can suppress automatic paste without suppressing explicit apertures", () => {
  const footprint: FootprintProps = { noSolderPaste: true }
  expect(footprintProps.parse(footprint).noSolderPaste).toBe(true)
  expect(footprintProps.parse({ noSolderPaste: false }).noSolderPaste).toBe(
    false,
  )
  expect(footprintProps.parse({}).noSolderPaste).toBeUndefined()
  expect(footprintProps.safeParse({ noSolderPaste: "true" }).success).toBe(
    false,
  )
})
