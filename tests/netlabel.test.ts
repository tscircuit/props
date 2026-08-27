import { expect, test } from "bun:test"
import { netLabelProps } from "../lib/components/netlabel"

test("net labels accept display text separate from net identity", () => {
  expect(
    netLabelProps.parse({
      net: "IBAT_HS_POS",
      displayName: "IBAT_HS+",
      connectsTo: "U1.pin1",
    }),
  ).toEqual({
    net: "IBAT_HS_POS",
    displayName: "IBAT_HS+",
    connectsTo: "U1.pin1",
  })
})
