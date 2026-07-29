import { expect, test } from "bun:test"
import { cadModelProp } from "../lib/common/cadModel"
import { chipProps } from "../lib/components/chip"

test("cadModel accepts a Footprinter string as the procedural model", () => {
  expect(cadModelProp.parse("soic8")).toBe("soic8")
  expect(() => cadModelProp.parse("")).toThrow()

  const parsedChip = chipProps.parse({
    name: "U1",
    cadModel: "soic8",
  })

  expect(parsedChip.cadModel).toBe("soic8")
})
