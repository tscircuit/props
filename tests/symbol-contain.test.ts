import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test("symbol preserves opt-in uniform fitting and explicit local viewbox", () => {
  const parsed = symbolProps.parse({
    width: "2mm",
    height: "1.2mm",
    fit: "contain",
    viewbox: { minX: "-0.5mm", maxX: "0.5mm", minY: "-0.5mm", maxY: "0.5mm" },
  })
  expect(parsed).toMatchObject({
    width: 2,
    height: 1.2,
    fit: "contain",
    viewbox: { minX: -0.5, maxX: 0.5, minY: -0.5, maxY: 0.5 },
  })
})
