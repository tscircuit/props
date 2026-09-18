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

test("should parse ViaProps with layers and net assignability flag", () => {
  const raw: ViaProps = {
    name: "v2",
    fromLayer: "inner7",
    toLayer: "inner8",
    layers: ["inner7", "inner8"],
    holeDiameter: "0.25mm",
    outerDiameter: "0.6mm",
    netIsAssignable: true,
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof viaProps>>()

  const parsed = viaProps.parse(raw)
  expect(parsed.fromLayer).toBe("inner7")
  expect(parsed.toLayer).toBe("inner8")
  expect(parsed.layers).toEqual(["inner7", "inner8"])
  expect(parsed.holeDiameter).toBe(0.25)
  expect(parsed.outerDiameter).toBe(0.6)
  expect(parsed.netIsAssignable).toBe(true)
})
