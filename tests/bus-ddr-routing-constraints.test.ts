import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("parses DDR bus routing constraints into canonical units", () => {
  const rawProps = {
    name: "DDR3_BYTE0",
    connections: ["DQ0", "DQ1", "DQ2", "DQ3"],
    maxLengthSkew: "4mil",
    targetImpedance: "50ohm",
    pcbTraceWidth: "5mil",
    pcbAllowedLayers: ["inner2"],
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual({
    ...rawProps,
    maxLengthSkew: 0.1016,
    targetImpedance: 50,
    pcbTraceWidth: 0.127,
  })
})

test("rejects invalid DDR bus routing constraints", () => {
  const baseProps = { connections: ["DQ0", "DQ1"] }

  expect(() =>
    busProps.parse({ ...baseProps, maxLengthSkew: "-1mm" }),
  ).toThrow()
  expect(() => busProps.parse({ ...baseProps, targetImpedance: 0 })).toThrow()
  expect(() => busProps.parse({ ...baseProps, pcbTraceWidth: 0 })).toThrow()
  expect(() => busProps.parse({ ...baseProps, pcbAllowedLayers: [] })).toThrow()
})
