import { expect, test } from "bun:test"
import { silkscreenRectProps } from "lib/components/silkscreen-rect"

test("silkscreen rect accepts unit-aware pcbRotation without changing dimensions", () => {
  for (const pcbRotation of [0, 90, 180, 270, "30deg", "-45deg"]) {
    const parsed = silkscreenRectProps.parse({
      width: "4mm",
      height: "2mm",
      pcbRotation,
    })
    expect(parsed.pcbRotation).toBe(
      typeof pcbRotation === "number" ? pcbRotation : parseFloat(pcbRotation),
    )
    expect(parsed.width).toBe(4)
    expect(parsed.height).toBe(2)
  }
  expect(
    silkscreenRectProps.parse({ width: 4, height: 2 }).pcbRotation,
  ).toBeUndefined()
})
