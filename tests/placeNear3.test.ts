import { expect, test } from "bun:test"
import { commonLayoutProps } from "lib/common/layout"

test("should parse placeNearMaxDistance as a number (meters)", () => {
  const parsed = commonLayoutProps.parse({
    placeNear: "U1.pin17",
    placeNearMaxDistance: 0.005,
  })
  expect(parsed.placeNear).toBe("U1.pin17")
  expect(parsed.placeNearMaxDistance).toBeCloseTo(0.005)
})
