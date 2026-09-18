import { expect, test } from "bun:test"
import { cadModelBase } from "../lib/common/cadModel"

/** Bounds retain the model-local min/max datum that `size` alone cannot carry. */
test("cadModel parses optional modelBounds dimensions", () => {
  const parsed = cadModelBase.parse({
    modelOriginPosition: { x: 0, y: 0, z: "-2.5mm" },
    modelBounds: {
      min: { x: "-4mm", y: "-3mm", z: "-3.1mm" },
      max: { x: "5mm", y: "3mm", z: "2.75mm" },
    },
  })

  expect(parsed.modelBounds).toEqual({
    min: { x: -4, y: -3, z: -3.1 },
    max: { x: 5, y: 3, z: 2.75 },
  })
  expect(cadModelBase.parse({}).modelBounds).toBeUndefined()
})
