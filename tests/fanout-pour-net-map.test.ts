import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { fanoutProps, type FanoutPourNetMap } from "lib/index"
import type { z } from "zod"

test("fanout pour maps use string layer keys while routing layers accept named objects", () => {
  expectTypeOf<z.input<typeof fanoutProps>["fanoutPourNetMap"]>().toEqualTypeOf<
    FanoutPourNetMap | undefined
  >()
  expect(
    fanoutProps.parse({
      fanoutRoutingLayers: [{ name: "top" }, "inner8"],
      fanoutPourNetMap: { top: "GND", inner8: ["VCC", "VDD"] },
    }),
  ).toEqual({
    fanoutRoutingLayers: ["top", "inner8"],
    fanoutPourNetMap: { top: "GND", inner8: ["VCC", "VDD"] },
  })
  for (const layer of ["bogus", "inner9", "[object Object]"]) {
    expect(
      fanoutProps.safeParse({ fanoutPourNetMap: { [layer]: "GND" } }).success,
    ).toBe(false)
  }
})
