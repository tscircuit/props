import { expect, test } from "bun:test"
import { cadModelProp } from "../lib/common/cadModel"
import { chipProps } from "../lib/components/chip"

test("cadModel accepts the footprinter_string procedural model", () => {
  expect(cadModelProp.parse("footprinter_string")).toBe("footprinter_string")

  const parsedChip = chipProps.parse({
    name: "U1",
    footprint: "soic8",
    cadModel: "footprinter_string",
  })

  expect(parsedChip.cadModel).toBe("footprinter_string")
})
