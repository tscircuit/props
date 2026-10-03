import { expect, test } from "bun:test"
import { busProps } from "../lib/components/bus"
import { differentialPairProps } from "../lib/components/differentialpair"
const profile = {
  profile: "ti_am335x_ddr3",
  interfaceName: "MEMORY",
  topology: "one_x16",
} as const

test("DDR metadata remains explicit and preserves normalized bus units", () => {
  const parsed = busProps.parse({
    name: "BYTE_ZERO",
    connections: ["DATA_A", "DATA_B"],
    maxLengthSkew: "25mil",
    targetImpedance: "60ohm",
    pcbDdrRouting: { ...profile, signalClass: "dq", byteIndex: 0 },
  })
  expect(parsed.pcbDdrRouting).toEqual({
    ...profile,
    signalClass: "dq",
    byteIndex: 0,
  })
  expect(parsed.maxLengthSkew).toBe(0.635)
  expect(parsed.targetImpedance).toBe(60)
  expect(
    busProps.parse({ connections: ["DATA"] }).pcbDdrRouting,
  ).toBeUndefined()
})
test("clock and strobe pairs retain their role and impedance intent", () => {
  const parsed = differentialPairProps.parse({
    positiveConnection: "P",
    negativeConnection: "N",
    targetDifferentialImpedance: "120ohm",
    maxLengthSkew: "5mil",
    pcbDdrRouting: { ...profile, signalClass: "dqs", byteIndex: 1 },
  })
  expect(parsed.targetDifferentialImpedance).toBe(120)
  expect(parsed.maxLengthSkew).toBe(0.127)
  expect(parsed.pcbDdrRouting?.byteIndex).toBe(1)
})
test("rejects missing or incompatible byte roles and unsupported topologies", () => {
  for (const routing of [
    { ...profile, signalClass: "dq" },
    { ...profile, signalClass: "dqs", byteIndex: 2 },
    { ...profile, signalClass: "ck", byteIndex: 0 },
    { ...profile, signalClass: "addr_ctrl", byteIndex: 1 },
    { ...profile, signalClass: "ck", topology: "two_x8" },
    { ...profile, signalClass: "ck", interfaceName: "" },
  ])
    expect(
      busProps.safeParse({ connections: ["DATA"], pcbDdrRouting: routing })
        .success,
    ).toBe(false)
})
