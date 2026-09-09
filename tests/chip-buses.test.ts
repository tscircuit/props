import { expect, test } from "bun:test"
import { busProps, chipProps, type ChipProps } from "lib"

test("chip bus declarations use standalone bus parsing", () => {
  const props: ChipProps = {
    name: "U1",
    buses: [
      {
        name: "DATA",
        pinNames: ["D0", "D1"],
        maxLengthSkew: "500um",
        targetImpedance: "50ohm",
        pcbTraceWidth: "0.2mm",
        pcbAllowedLayers: ["top", "bottom"],
        preferredLayer: "top",
        preferredLayers: ["top", "bottom"],
        routingPhaseIndex: 1,
      },
      { pinNames: ["RESET"], routingPhaseIndex: null },
    ],
  }
  const parsed = chipProps.parse(props)
  expect(parsed.buses).toEqual(
    props.buses!.map(({ pinNames, ...options }) => {
      const { connections, ...parsedOptions } = busProps.parse({
        ...options,
        connections: pinNames,
      })
      return { ...parsedOptions, pinNames: connections }
    }),
  )
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
    { connections: ["DATA"] },
    { pinNames: [] },
    { pinNames: [".U1 > .D0"] },
    { pinNames: [1] },
    { pinNames: ["DATA"], maxLengthSkew: "-1mm" },
    { pinNames: ["DATA"], targetImpedance: 0 },
    { pinNames: ["DATA"], pcbTraceWidth: 0 },
    { pinNames: ["DATA"], pcbAllowedLayers: [] },
    { pinNames: ["DATA"], preferredLayers: [] },
  ]) {
    const result = chipProps.safeParse({ name: "U1", buses: [bus] })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path.slice(0, 2)).toEqual(["buses", 0])
    }
  }
})

test("chip buses require pinNames at compile time", () => {
  const props: ChipProps = {
    name: "U1",
    // @ts-expect-error Each bus requires pinNames.
    buses: [{ name: "DATA" }],
  }
  void props
})

test("chip bus pinNames follow the chip pin label type", () => {
  const pinLabels = { pin1: "D0", pin2: "D1" } as const
  const props: ChipProps<typeof pinLabels> = {
    name: "U1",
    pinLabels,
    buses: [{ pinNames: ["D0", "pin2"] }],
  }
  expect(chipProps.parse(props).buses?.[0]?.pinNames).toEqual(["D0", "pin2"])
  const invalid: ChipProps<typeof pinLabels> = {
    // @ts-expect-error Bus members must be known chip pin names.
    buses: [{ pinNames: ["UNKNOWN"] }],
  }
  void invalid
})
