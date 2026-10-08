import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  pcbReturnCurrentExcitationProps,
  pcbReturnCurrentSimulationProps,
  type PcbReturnCurrentExcitationProps,
  type PcbReturnCurrentSimulationProps,
} from "lib/index"

const excitation: PcbReturnCurrentExcitationProps = {
  source: ".U1 > .OUT",
  load: ".U2 > .IN",
  ground: "net.GND",
  current: "5mA",
  returnSource: ".U2 > .GND",
  returnSink: ".U1 > .GND",
  sourceImpedance: "25ohm",
  loadImpedance: "100Ω",
}

test("pending experiment and explicit terminal props are exported and normalize to SI", () => {
  const simulation: PcbReturnCurrentSimulationProps = {
    name: " DDR data ",
    children: ["nested excitation"],
  }
  expect(pcbReturnCurrentSimulationProps.parse(simulation)).toEqual({
    name: "DDR data",
    children: ["nested excitation"],
  })
  expect(pcbReturnCurrentSimulationProps.parse({})).toEqual({})
  const parsed = pcbReturnCurrentExcitationProps.parse({
    ...excitation,
    name: " D13 ",
    source: " .U1 > .OUT ",
    trace: " .D13 ",
    returnSourceLayer: { name: "bottom" },
    returnSinkLayer: "top",
  })
  expect(parsed).toEqual({
    ...excitation,
    name: "D13",
    source: ".U1 > .OUT",
    current: 0.005,
    sourceImpedance: 25,
    loadImpedance: 100,
    trace: ".D13",
    returnSourceLayer: "bottom",
    returnSinkLayer: "top",
  })
  expectTypeOf(parsed.current).toEqualTypeOf<number>()
  expectTypeOf(parsed.sourceImpedance).toEqualTypeOf<number>()
  expectTypeOf(parsed.loadImpedance).toEqualTypeOf<number>()
})

test("current and resistance unit strings preserve physical dimensions and SI prefix case", () => {
  for (const [input, amperes] of [
    [0.005, 0.005],
    ["5e-3", 0.005],
    [" 5 mA ", 0.005],
    ["250uA", 250e-6],
    ["250µA", 250e-6],
    ["250μA", 250e-6],
    ["5nA", 5e-9],
    ["1e-3A", 0.001],
  ] as const) {
    expect(
      pcbReturnCurrentExcitationProps.parse({ ...excitation, current: input })
        .current,
    ).toBeCloseTo(amperes, 12)
  }
  for (const [input, ohms] of [
    [100, 100],
    ["100", 100],
    ["100ohms", 100],
    ["1kohm", 1000],
    ["1kΩ", 1000],
    ["1MOhm", 1e6],
    ["1mΩ", 0.001],
    ["1e2ohm", 100],
  ] as const) {
    const parsed = pcbReturnCurrentExcitationProps.parse({
      ...excitation,
      sourceImpedance: input,
      loadImpedance: input,
    })
    expect(parsed.sourceImpedance).toBeCloseTo(ohms, 12)
    expect(parsed.loadImpedance).toBeCloseTo(ohms, 12)
  }
})

test("missing electrical values or return terminals never receive defaults", () => {
  for (const prop of [
    "source",
    "load",
    "ground",
    "current",
    "returnSource",
    "returnSink",
    "sourceImpedance",
    "loadImpedance",
  ] as const) {
    const input = { ...excitation }
    delete (input as Partial<PcbReturnCurrentExcitationProps>)[prop]
    const parsed = pcbReturnCurrentExcitationProps.safeParse(input)
    expect(parsed.success).toBe(false)
    if (!parsed.success) expect(parsed.error.issues[0]!.path).toEqual([prop])
  }
})

test("nonpositive, nonfinite, wrong-dimension and incomplete quantities fail validation", () => {
  for (const input of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "1e999"])
    for (const prop of ["current", "sourceImpedance", "loadImpedance"] as const)
      expect(
        pcbReturnCurrentExcitationProps.safeParse({
          ...excitation,
          [prop]: input,
        }).success,
      ).toBe(false)
  for (const current of ["", "5mV", "5ohm", "5mA junk", "5mArms"])
    expect(
      pcbReturnCurrentExcitationProps.safeParse({ ...excitation, current })
        .success,
    ).toBe(false)
  for (const sourceImpedance of ["", "100A", "25+j5Ω", "25±5ohm", "1kHz"])
    expect(
      pcbReturnCurrentExcitationProps.safeParse({
        ...excitation,
        sourceImpedance,
      }).success,
    ).toBe(false)
})

test("empty selectors and unsupported layer names fail instead of guessing contacts", () => {
  for (const prop of [
    "source",
    "load",
    "ground",
    "returnSource",
    "returnSink",
    "trace",
  ])
    expect(
      pcbReturnCurrentExcitationProps.safeParse({
        ...excitation,
        [prop]: "  ",
      }).success,
    ).toBe(false)
  for (const returnSourceLayer of ["front", "inner9", { name: "outer" }])
    expect(
      pcbReturnCurrentExcitationProps.safeParse({
        ...excitation,
        returnSourceLayer,
      }).success,
    ).toBe(false)
})

test("unsupported run options and aliases fail instead of disappearing", () => {
  for (const props of [{ frequency: "100MHz" }, { cellSize: "0.05mm" }]) {
    expect(pcbReturnCurrentSimulationProps.safeParse(props).success).toBe(false)
    expect(
      pcbReturnCurrentExcitationProps.safeParse({ ...excitation, ...props })
        .success,
    ).toBe(false)
  }
  expect(
    pcbReturnCurrentExcitationProps.safeParse({
      ...excitation,
      sourceReference: excitation.returnSink,
    }).success,
  ).toBe(false)
})
