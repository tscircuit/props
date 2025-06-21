import { expect, test } from "bun:test"
import { viaProps, type ViaProps } from "lib/components/via"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse ViaProps with name and connectsTo", () => {
  const raw: ViaProps = {
    name: "v1",
    fromLayer: "top",
    toLayer: "bottom",
    holeDiameter: 0.3,
    outerDiameter: "0.8mm",
    connectsTo: ["net1", "net2"],
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof viaProps>>()

  const parsed = viaProps.parse(raw)
  expect(parsed.name).toBe("v1")
  expect(parsed.connectsTo).toEqual(["net1", "net2"])
  expect(parsed.outerDiameter).toBe(0.8)
})
