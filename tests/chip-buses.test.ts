import { expect, test } from "bun:test"
import { busProps, chipProps, type ChipProps } from "lib"

test("chip bus declarations use standalone bus parsing", () => {
  const props: ChipProps = {
    name: "U1",
    buses: [
      {
        name: "DATA",
        connections: [".U1 > .D0", ".U1 > .D1"],
        maxLengthSkew: "500um",
        targetImpedance: "50ohm",
        pcbTraceWidth: "0.2mm",
        pcbAllowedLayers: ["top", "bottom"],
        preferredLayer: "top",
        preferredLayers: ["top", "bottom"],
        routingPhaseIndex: 1,
      },
      { connections: ["RESET"], routingPhaseIndex: null },
    ],
  }
  const parsed = chipProps.parse(props)
  expect(parsed.buses).toEqual(props.buses!.map((bus) => busProps.parse(bus)))
  expect(parsed.buses?.[0]?.maxLengthSkew).toBe(0.5)
  expect(parsed.buses?.[0]?.targetImpedance).toBe(50)
  expect(parsed.buses?.[0]?.pcbTraceWidth).toBe(0.2)
})

test("chip buses are optional and may be empty", () => {
  expect(chipProps.parse({ name: "U1" }).buses).toBeUndefined()
  expect(chipProps.parse({ name: "U1", buses: [] }).buses).toEqual([])
})

test("chip rejects invalid nested bus declarations", () => {
  for (const bus of [
    {},
    { connections: [] },
    { connections: [1] },
    { connections: ["DATA"], maxLengthSkew: "-1mm" },
    { connections: ["DATA"], targetImpedance: 0 },
    { connections: ["DATA"], pcbTraceWidth: 0 },
    { connections: ["DATA"], pcbAllowedLayers: [] },
    { connections: ["DATA"], preferredLayers: [] },
  ]) {
    const result = chipProps.safeParse({ name: "U1", buses: [bus] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path.slice(0, 2)).toEqual(["buses", 0])
    }
  }
})

test("chip buses require connections at compile time", () => {
  const props: ChipProps = {
    name: "U1",
    // @ts-expect-error Each bus requires connections.
    buses: [{ name: "DATA" }],
  }
  void props
})
