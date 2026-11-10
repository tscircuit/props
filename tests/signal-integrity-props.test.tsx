import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { Children, type Attributes, type ReactElement } from "react"
import type { z } from "zod"
import {
  pcbTransientChannelSimulationProps,
  pcbChannelProps,
  type PcbTransientChannelSimulationProps,
  type PcbChannelProps,
  type SignalEndpoint,
} from "../lib"

// Match core's typed namespace without coupling props tests to the renderer.
const simulation = {
  pcbtransientchannelsimulation: (_: PcbTransientChannelSimulationProps) =>
    null,
  pcbchannel: (_: PcbChannelProps & Attributes) => null,
}

function parseBlock(element: ReactElement<PcbTransientChannelSimulationProps>) {
  return {
    block: pcbTransientChannelSimulationProps.parse(element.props),
    signals: Children.toArray(element.props.children).map((child) =>
      pcbChannelProps.parse((child as ReactElement<PcbChannelProps>).props),
    ),
  }
}

test("Level 1 single-ended TSX supplies the RFC defaults", () => {
  const { block, signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation bitRate="20Mbps">
      <simulation.pcbchannel
        name="DATA"
        driverRef=".TX > .Y"
        receiverRef=".RX > .A"
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(block).toMatchObject({
    bitRate: 20e6,
    corner: "typical",
    unlistedNets: "passive",
    unrouted: "error",
    pdn: "ideal",
  })
  expect(block).not.toHaveProperty("duration")
  expect(block).not.toHaveProperty("supply")
  expect(signals).toEqual([
    {
      name: "DATA",
      driverRef: ".TX > .Y",
      receiverRef: ".RX > .A",
      pattern: "prbs7",
      offset: "0UI",
      probe: "local",
    },
  ])
})

test("Level 1 differential TSX uses objects, and multi-drop arrays stay receivers", () => {
  const driverRef = { p: ".TX > .A", n: ".TX > .B" }
  const receiverRef = { p: ".RX > .A", n: ".RX > .B" }
  const { block, signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation bitRate="250kbps">
      <simulation.pcbchannel
        name="BUS"
        driverRef={driverRef}
        receiverRef={receiverRef}
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(block.bitRate).toBe(250e3)
  expect(signals[0]).toMatchObject({ driverRef, receiverRef })

  const receivers = [
    receiverRef,
    { pin: receiverRef, model: "BUS_ODT" },
    ".RX3 > .A",
    ".RX4 > .A",
  ]
  const bus = (
    <simulation.pcbchannel
      name="BUS"
      driverRef={{ pin: driverRef, model: "BUS_DRIVE" }}
      receiverRef={receivers}
    />
  )
  expect(pcbChannelProps.parse(bus.props)).toMatchObject({
    driverRef: { pin: driverRef, model: "BUS_DRIVE" },
    receiverRef: receivers,
  })
  expect(
    pcbChannelProps.parse({
      ...bus.props,
      receiverRef: [".RX > .A", ".RX > .B"],
    }).receiverRef,
  ).toEqual([".RX > .A", ".RX > .B"])
})

test.each(["low", "high", "off"] as const)(
  "quiet=%s declares a crosstalk victim",
  (quiet) => {
    const victim = (
      <simulation.pcbchannel
        name="D1"
        driverRef=".TX > .D1"
        receiverRef=".RX > .D1"
        quiet={quiet}
      />
    )
    expect(pcbChannelProps.parse(victim.props).quiet).toBe(quiet)
  },
)

test("RFC DDR3 write TSX supplies per-leg models and a half-UI offset", () => {
  const { signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation
      name="WRITE"
      bitRate="800Mbps"
      corner="typical"
      pdn="ideal"
      unrouted="ideal"
    >
      <simulation.pcbchannel
        name="DQS"
        driverRef={{
          pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
          model: { p: "Model_579", n: "Model_771" },
        }}
        receiverRef={{
          pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
          model: { p: "ODT_off", n: "ODT_off" },
        }}
        pattern="clock"
        offset="0.5UI"
      />
      <simulation.pcbchannel
        name="DQ0"
        driverRef={{ pin: ".CPU > .DDR_D0", model: "Model_257" }}
        receiverRef={{ pin: ".DRAM > .DQL0", model: "ODT_off" }}
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(signals[0]).toMatchObject({
    pattern: "clock",
    offset: "0.5UI",
    driverRef: {
      pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
      model: { p: "Model_579", n: "Model_771" },
    },
    receiverRef: {
      pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
      model: { p: "ODT_off", n: "ODT_off" },
    },
  })
  expect(signals[1]).toMatchObject({
    receiverRef: { pin: ".DRAM > .DQL0", model: "ODT_off" },
  })
})

const data = { name: "DATA", driverRef: ".TX > .Y", receiverRef: ".RX > .A" }

test.each(["typical", "minimum", "maximum"] as const)(
  "accepts the spelled-out corner %s",
  (corner) => {
    const block = (
      <simulation.pcbtransientchannelsimulation
        bitRate="20Mbps"
        corner={corner}
      />
    )
    expect(pcbTransientChannelSimulationProps.parse(block.props).corner).toBe(
      corner,
    )
  },
)

test.each(["typ", "min", "max"])("rejects removed corner %s", (corner) => {
  // @ts-expect-error Abbreviated corners are removed from the authoring API.
  const invalidCorner: PcbTransientChannelSimulationProps["corner"] = corner
  const block = (
    <simulation.pcbtransientchannelsimulation
      bitRate="20Mbps"
      corner={invalidCorner}
    />
  )
  expect(
    pcbTransientChannelSimulationProps.safeParse(block.props).success,
  ).toBe(false)
})

test.each([
  "driver",
  "receiver",
  "strobe",
  "strobeRef",
  "mask",
  "setup",
  "hold",
  "thresholds",
])("rejects the removed %s prop even alongside valid selectors", (prop) => {
  const signal = <simulation.pcbchannel {...data} {...{ [prop]: ".OLD" }} />
  expect(pcbChannelProps.safeParse(signal.props).success).toBe(false)
})

test("authoring inputs and normalized outputs preserve their types", () => {
  expectTypeOf<
    z.input<typeof pcbChannelProps>
  >().toEqualTypeOf<PcbChannelProps>()
  expectTypeOf<
    z.input<typeof pcbTransientChannelSimulationProps>
  >().toEqualTypeOf<PcbTransientChannelSimulationProps>()
  expectTypeOf<
    z.output<typeof pcbTransientChannelSimulationProps>["duration"]
  >().toEqualTypeOf<number | undefined>()
  expectTypeOf<
    z.output<typeof pcbTransientChannelSimulationProps>["bitRate"]
  >().toEqualTypeOf<number>()
  // @ts-expect-error Per-leg models require a differential pin pair.
  const single: SignalEndpoint = { pin: ".TX > .Y", model: { p: "P", n: "N" } }
  expect(
    pcbChannelProps.safeParse({ ...data, driverRef: single }).success,
  ).toBe(false)
})

test("bare quiet and boolean quiet report the RFC diagnostic", () => {
  // @ts-expect-error A bare quiet attribute is boolean, not a level.
  const bare = <simulation.pcbchannel {...data} quiet />
  for (const props of [
    bare.props,
    { ...data, quiet: true },
    { ...data, quiet: false },
  ]) {
    const parsed = pcbChannelProps.safeParse(props)
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues).toEqual([
        expect.objectContaining({
          path: ["quiet"],
          message: 'quiet needs a level: "low", "high" or "off".',
        }),
      ])
    }
  }
})

test("endpoint arrays cannot be drivers or wrapped differential pairs", () => {
  const arrayDriver = (
    // @ts-expect-error An array is never a differential driver.
    <simulation.pcbchannel {...data} driverRef={[".TX > .P", ".TX > .N"]} />
  )
  expect(pcbChannelProps.safeParse(arrayDriver.props).success).toBe(false)
  for (const driverRef of [
    { pin: [".TX > .P", ".TX > .N"] },
    { p: ".TX > .P" },
    { p: ".TX > .P", n: ".TX > .N", model: "wrong_wrapper" },
    { pin: ".TX > .Y", model: { p: "Model_579", n: "Model_771" } },
    { pin: { p: ".TX > .P", n: ".TX > .N" }, model: { p: "Model_579" } },
    { pin: { p: ".TX > .P", n: ".TX > .N" }, model: { p: "", n: "N" } },
    {
      pin: { p: ".TX > .P", n: ".TX > .N" },
      model: { p: "P", n: "N", extra: "invalid" },
    },
  ]) {
    expect(pcbChannelProps.safeParse({ ...data, driverRef }).success).toBe(
      false,
    )
  }
  expect(pcbChannelProps.safeParse({ ...data, receiverRef: [] }).success).toBe(
    false,
  )
})

test.each([
  [undefined, 127],
  ["prbs7", 127],
  ["prbs15", 32767],
  ["prbs31", 2147483647],
] as const)(
  "PRBS pattern %s validates the full nonzero seed range",
  (pattern, max) => {
    for (const quiet of [undefined, "low", "high", "off"] as const) {
      for (const seed of [1, max]) {
        const signal = (
          <simulation.pcbchannel
            {...data}
            pattern={pattern}
            seed={seed}
            quiet={quiet}
          />
        )
        expect(pcbChannelProps.parse(signal.props).seed).toBe(seed)
      }
      for (const seed of [0, -1, 0.5, 1.5, max + 1, NaN, Infinity, -Infinity]) {
        const signal = (
          <simulation.pcbchannel
            {...data}
            pattern={pattern}
            seed={seed}
            quiet={quiet}
          />
        )
        const parsed = pcbChannelProps.safeParse(signal.props)
        expect(parsed.success).toBe(false)
        if (!parsed.success)
          expect(parsed.error.issues[0]?.path).toEqual(["seed"])
      }
    }
    const signal = <simulation.pcbchannel {...data} pattern={pattern} />
    expect(pcbChannelProps.parse(signal.props)).not.toHaveProperty("seed")
  },
)

test.each(["prbs7", "prbs15", "prbs31", "clock", "0011010"])(
  "accepts pattern %s",
  (pattern) => {
    expect(pcbChannelProps.parse({ ...data, pattern }).pattern).toBe(pattern)
  },
)

test.each(["prbs9", "", "012", "random", 101, { type: "prbs7" }])(
  "rejects unknown pattern %j",
  (pattern) => {
    expect(pcbChannelProps.safeParse({ ...data, pattern }).success).toBe(false)
  },
)

test.each([
  ["20Mbps", 20e6],
  ["250kbps", 250e3],
  [20e6, 20e6],
  ["1.6Gbps", 1.6e9],
  ["2e7bit/s", 20e6],
] as const)("parses bit rate %s as bit/s", (bitRate, expected) => {
  expect(pcbTransientChannelSimulationProps.parse({ bitRate }).bitRate).toBe(
    expected,
  )
  expect(pcbChannelProps.parse({ ...data, bitRate }).bitRate).toBe(expected)
})

test.each([0, -1, Infinity, NaN, "20MHz", "20MBps", "garbage"])(
  "rejects invalid bit rate %j",
  (bitRate) => {
    expect(
      pcbTransientChannelSimulationProps.safeParse({ bitRate }).success,
    ).toBe(false)
    expect(pcbChannelProps.safeParse({ ...data, bitRate }).success).toBe(false)
  },
)

test("times parse to seconds and UI offsets retain their relative units", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: "20Mbps",
      duration: "2us",
    }).duration,
  ).toBe(2e-6)
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: "20Mbps",
      duration: "32UI",
    }).duration,
  ).toBe(32 / 20e6)
  expect(
    pcbTransientChannelSimulationProps.parse({ bitRate: 20e6, duration: 2 })
      .duration,
  ).toBe(2)
  expect(pcbChannelProps.parse({ ...data, offset: "2ns" }).offset).toBe(2e-9)
  expect(pcbChannelProps.parse({ ...data, offset: " 0.250 UI " }).offset).toBe(
    "0.25UI",
  )
  expect(pcbChannelProps.parse({ ...data, offset: 0.25 }).offset).toBe(0.25)
})

test("duration absence stays automatic and extracted PDN stays schema-valid", () => {
  const block = (
    <simulation.pcbtransientchannelsimulation
      bitRate="20Mbps"
      pdn="extracted"
      duration={undefined}
    />
  )
  const parsed = pcbTransientChannelSimulationProps.parse(block.props)
  expect(parsed.pdn).toBe("extracted")
  expect(parsed).not.toHaveProperty("duration")
})

test("removed supply has neither an authoring type nor a runtime alias", () => {
  const block = (
    // @ts-expect-error Rails come from the selected IBIS models at the test corner.
    <simulation.pcbtransientchannelsimulation bitRate="20Mbps" supply="ibis" />
  )
  expect(
    pcbTransientChannelSimulationProps.safeParse(block.props).success,
  ).toBe(false)
  expect(
    pcbTransientChannelSimulationProps.safeParse({
      ...block.props,
      supply: "board",
    }).success,
  ).toBe(false)
})

test.each(["1V", "garbage", "-1UI", -1, Infinity])(
  "rejects invalid offset %j",
  (value) => {
    expect(pcbChannelProps.safeParse({ ...data, offset: value }).success).toBe(
      false,
    )
  },
)

test("literal bit patterns have no length cap", () => {
  expect(
    pcbChannelProps.parse({ ...data, pattern: "1".repeat(65537) }).pattern,
  ).toHaveLength(65537)
})

test("block rate is required and numerical extraction settings are not props", () => {
  expect(pcbTransientChannelSimulationProps.safeParse({}).success).toBe(false)
  expect(
    pcbTransientChannelSimulationProps.safeParse({ bitRate: 20e6, sections: 4 })
      .success,
  ).toBe(false)
  expect(
    pcbChannelProps.safeParse({ ...data, termination: "120ohm" }).success,
  ).toBe(false)
})

test.each([
  ...[
    0,
    -1,
    Infinity,
    NaN,
    "-1ns",
    "0UI",
    "1e400s",
    "1V",
    "garbage",
    "-1UI",
  ].map((duration) => [20e6, duration] as const),
  [1e-320, "1UI"],
  [1e308, "1e-20UI"],
] as const)(
  "invalid duration at %s bps: %j reports the RFC diagnostic",
  (bitRate, duration) => {
    const block = (
      <simulation.pcbtransientchannelsimulation
        bitRate={bitRate}
        duration={duration}
      />
    )
    const parsed = pcbTransientChannelSimulationProps.safeParse(block.props)
    expect(parsed.success).toBe(false)
    if (!parsed.success)
      expect(parsed.error.issues[0]).toMatchObject({
        path: ["duration"],
        message: "duration must be finite and greater than zero.",
      })
  },
)
