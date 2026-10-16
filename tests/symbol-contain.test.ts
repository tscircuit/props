import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test.failing(
  "symbol preserves opt-in uniform fitting and explicit local viewbox",
  () => {
    const parsed = symbolProps.parse({
      width: "2mm",
      height: "1.2mm",
      fit: "contain",
      viewbox: { x: "-0.5mm", y: "-0.5mm", width: "1mm", height: "1mm" },
    })
    expect(parsed).toMatchObject({
      width: 2,
      height: 1.2,
      fit: "contain",
      viewbox: { x: -0.5, y: -0.5, width: 1, height: 1 },
    })
  },
)
