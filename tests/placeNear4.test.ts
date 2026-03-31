import { expect, test } from "bun:test"
import { commonLayoutProps } from "lib/common/layout"

test("should allow placeNear without facingPad", () => {
  const parsed = commonLayoutProps.parse({ placeNear: "U1.VCC" })
  expect(parsed.placeNear).toBe("U1.VCC")
  expect(parsed.facingPad).toBeUndefined()
})
