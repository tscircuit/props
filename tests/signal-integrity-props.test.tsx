import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { Children, type Attributes, type ReactElement } from "react"
import type { z } from "zod"
import {
  signalIntegritySimulationProps,
  signalIntegritySignalProps,
  type SignalIntegritySimulationProps,
  type SignalIntegritySignalProps,
  type SignalEndpoint,
} from "../lib"

// Match core's typed namespace without coupling props tests to the renderer.
const signalintegrity = {
  simulation: (_: SignalIntegritySimulationProps) => null,
  signal: (_: SignalIntegritySignalProps & Attributes) => null,
}

function parseBlock(element: ReactElement<SignalIntegritySimulationProps>) {
  return {
    block: signalIntegritySimulationProps.parse(element.props),
    signals: Children.toArray(element.props.children).map((child) =>
      signalIntegritySignalProps.parse(
        (child as ReactElement<SignalIntegritySignalProps>).props,
      ),
    ),
  }
}

test("Level 1 single-ended TSX supplies the RFC defaults", () => {
  const { block, signals } = parseBlock(
    <signalintegrity.simulation bitRate="20Mbps">
      <signalintegrity.signal
        name="DATA"
        driverRef=".TX > .Y"
        receiverRef=".RX > .A"
      />
    </signalintegrity.simulation>,
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
      mask: "ibis",
    },
  ])
})

test("Level 1 differential TSX uses objects, and multi-drop arrays stay receivers", () => {
  const driverRef = { p: ".TX > .A", n: ".TX > .B" }
  const receiverRef = { p: ".RX > .A", n: ".RX > .B" }
  const { block, signals } = parseBlock(
    <signalintegrity.simulation bitRate="250kbps">
      <signalintegrity.signal
        name="BUS"
        driverRef={driverRef}
        receiverRef={receiverRef}
      />
    </signalintegrity.simulation>,
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
    <signalintegrity.signal
      name="BUS"
      driverRef={{ pin: driverRef, model: "BUS_DRIVE" }}
      receiverRef={receivers}
    />
  )
  expect(signalIntegritySignalProps.parse(bus.props)).toMatchObject({
    driverRef: { pin: driverRef, model: "BUS_DRIVE" },
    receiverRef: receivers,
  })
  expect(
    signalIntegritySignalProps.parse({
      ...bus.props,
      receiverRef: [".RX > .A", ".RX > .B"],
    }).receiverRef,
  ).toEqual([".RX > .A", ".RX > .B"])
})

test.each(["low", "high", "off"] as const)(
  "quiet=%s declares a crosstalk victim",
  (quiet) => {
    const victim = (
      <signalintegrity.signal
        name="D1"
        driverRef=".TX > .D1"
        receiverRef=".RX > .D1"
        quiet={quiet}
      />
    )
    expect(signalIntegritySignalProps.parse(victim.props).quiet).toBe(quiet)
  },
)

test("RFC DDR3 write TSX supplies per-leg models, a strobeRef and normalized mask", () => {
  const { signals } = parseBlock(
    <signalintegrity.simulation
      name="WRITE"
      bitRate="800Mbps"
      corner="typical"
      pdn="ideal"
      unrouted="ideal"
    >
      <signalintegrity.signal
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
      <signalintegrity.signal
        name="DQ0"
        driverRef={{ pin: ".CPU > .DDR_D0", model: "Model_257" }}
        receiverRef={{ pin: ".DRAM > .DQL0", model: "ODT_off" }}
        strobeRef="DQS"
        mask={{ setup: "10ps", hold: "45ps" }}
      />
    </signalintegrity.simulation>,
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
    strobeRef: "DQS",
    receiverRef: { pin: ".DRAM > .DQL0", model: "ODT_off" },
  })
  expect(signals[1]?.mask).toEqual({
    setup: 10e-12,
    hold: 45e-12,
  })
})

const data = { name: "DATA", driverRef: ".TX > .Y", receiverRef: ".RX > .A" }

test.each(["typical", "minimum", "maximum"] as const)(
  "accepts the spelled-out corner %s",
  (corner) => {
    const block = (
      <signalintegrity.simulation bitRate="20Mbps" corner={corner} />
    )
    expect(signalIntegritySimulationProps.parse(block.props).corner).toBe(
      corner,
    )
  },
)

test.each(["typ", "min", "max"])("rejects removed corner %s", (corner) => {
  // @ts-expect-error Abbreviated corners are removed from the authoring API.
  const block = <signalintegrity.simulation bitRate="20Mbps" corner={corner} />
  expect(signalIntegritySimulationProps.safeParse(block.props).success).toBe(
    false,
  )
})

test.each(["driver", "receiver", "strobe"])(
  "rejects the removed %s prop even alongside valid selectors",
  (prop) => {
    const signal = <signalintegrity.signal {...data} {...{ [prop]: ".OLD" }} />
    expect(signalIntegritySignalProps.safeParse(signal.props).success).toBe(
      false,
    )
  },
)

test("authoring inputs and normalized outputs preserve their types", () => {
  expectTypeOf<
    z.input<typeof signalIntegritySignalProps>
  >().toEqualTypeOf<SignalIntegritySignalProps>()
  expectTypeOf<
    z.input<typeof signalIntegritySimulationProps>
  >().toEqualTypeOf<SignalIntegritySimulationProps>()
  expectTypeOf<
    z.output<typeof signalIntegritySimulationProps>["duration"]
  >().toEqualTypeOf<number | undefined>()
  expectTypeOf<
    z.output<typeof signalIntegritySimulationProps>["bitRate"]
  >().toEqualTypeOf<number>()
  // @ts-expect-error Per-leg models require a differential pin pair.
  const single: SignalEndpoint = { pin: ".TX > .Y", model: { p: "P", n: "N" } }
  expect(
    signalIntegritySignalProps.safeParse({ ...data, driverRef: single })
      .success,
  ).toBe(false)
})

test("bare quiet and boolean quiet report the RFC diagnostic", () => {
  // @ts-expect-error A bare quiet attribute is boolean, not a level.
  const bare = <signalintegrity.signal {...data} quiet />
  for (const props of [
    bare.props,
    { ...data, quiet: true },
    { ...data, quiet: false },
  ]) {
    const parsed = signalIntegritySignalProps.safeParse(props)
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
    <signalintegrity.signal {...data} driverRef={[".TX > .P", ".TX > .N"]} />
  )
  expect(signalIntegritySignalProps.safeParse(arrayDriver.props).success).toBe(
    false,
  )
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
    expect(
      signalIntegritySignalProps.safeParse({ ...data, driverRef }).success,
    ).toBe(false)
  }
  expect(
    signalIntegritySignalProps.safeParse({ ...data, receiverRef: [] }).success,
  ).toBe(false)
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
          <signalintegrity.signal
            {...data}
            pattern={pattern}
            seed={seed}
            quiet={quiet}
          />
        )
        expect(signalIntegritySignalProps.parse(signal.props).seed).toBe(seed)
      }
      for (const seed of [0, -1, 0.5, 1.5, max + 1, NaN, Infinity, -Infinity]) {
        const signal = (
          <signalintegrity.signal
            {...data}
            pattern={pattern}
            seed={seed}
            quiet={quiet}
          />
        )
        const parsed = signalIntegritySignalProps.safeParse(signal.props)
        expect(parsed.success).toBe(false)
        if (!parsed.success)
          expect(parsed.error.issues[0]?.path).toEqual(["seed"])
      }
    }
    const signal = <signalintegrity.signal {...data} pattern={pattern} />
    expect(signalIntegritySignalProps.parse(signal.props)).not.toHaveProperty(
      "seed",
    )
  },
)

test.each(["prbs7", "prbs15", "prbs31", "clock", "0011010"])(
  "accepts pattern %s",
  (pattern) => {
    expect(signalIntegritySignalProps.parse({ ...data, pattern }).pattern).toBe(
      pattern,
    )
  },
)

test.each(["prbs9", "", "012", "random", 101, { type: "prbs7" }])(
  "rejects unknown pattern %j",
  (pattern) => {
    expect(
      signalIntegritySignalProps.safeParse({ ...data, pattern }).success,
    ).toBe(false)
  },
)

test.each([
  ["20Mbps", 20e6],
  ["250kbps", 250e3],
  [20e6, 20e6],
  ["1.6Gbps", 1.6e9],
  ["2e7bit/s", 20e6],
] as const)("parses bit rate %s as bit/s", (bitRate, expected) => {
  expect(signalIntegritySimulationProps.parse({ bitRate }).bitRate).toBe(
    expected,
  )
  expect(signalIntegritySignalProps.parse({ ...data, bitRate }).bitRate).toBe(
    expected,
  )
})

test.each([0, -1, Infinity, NaN, "20MHz", "20MBps", "garbage"])(
  "rejects invalid bit rate %j",
  (bitRate) => {
    expect(signalIntegritySimulationProps.safeParse({ bitRate }).success).toBe(
      false,
    )
    expect(
      signalIntegritySignalProps.safeParse({ ...data, bitRate }).success,
    ).toBe(false)
  },
)

test("times parse to seconds and UI offsets retain their relative units", () => {
  expect(
    signalIntegritySimulationProps.parse({ bitRate: "20Mbps", duration: "2us" })
      .duration,
  ).toBe(2e-6)
  expect(
    signalIntegritySimulationProps.parse({
      bitRate: "20Mbps",
      duration: "32UI",
    }).duration,
  ).toBe(32 / 20e6)
  expect(
    signalIntegritySimulationProps.parse({ bitRate: 20e6, duration: 2 })
      .duration,
  ).toBe(2)
  expect(
    signalIntegritySignalProps.parse({ ...data, offset: "2ns" }).offset,
  ).toBe(2e-9)
  expect(
    signalIntegritySignalProps.parse({ ...data, offset: " 0.250 UI " }).offset,
  ).toBe("0.25UI")
  expect(
    signalIntegritySignalProps.parse({ ...data, offset: 0.25 }).offset,
  ).toBe(0.25)
  expect(
    signalIntegritySignalProps.parse({
      ...data,
      mask: { vih: 1.2, vil: -0.1, setup: 75e-12, hold: 0 },
    }).mask,
  ).toEqual({ vih: 1.2, vil: -0.1, setup: 75e-12, hold: 0 })
})

test("setup/hold schema permits core to report the missing-strobeRef diagnostic", () => {
  expect(
    signalIntegritySignalProps.parse({
      ...data,
      mask: { setup: "75ps", hold: "100ps" },
    }).strobeRef,
  ).toBeUndefined()
})

test.each(["setup", "hold"] as const)(
  "mask.%s is finite and nonnegative",
  (field) => {
    for (const value of [-1e-10, "-75ps", Infinity, -Infinity, NaN]) {
      const signal = (
        <signalintegrity.signal
          {...data}
          strobeRef="DQS"
          mask={{ [field]: value }}
        />
      )
      expect(signalIntegritySignalProps.safeParse(signal.props).success).toBe(
        false,
      )
    }
    for (const value of [0, "0ps", "75ps"]) {
      const signal = (
        <signalintegrity.signal
          {...data}
          strobeRef="DQS"
          mask={{ [field]: value }}
        />
      )
      expect(signalIntegritySignalProps.safeParse(signal.props).success).toBe(
        true,
      )
    }
  },
)

test("mask voltages retain signed differential thresholds", () => {
  const signal = (
    <signalintegrity.signal {...data} mask={{ vih: "200mV", vil: "-200mV" }} />
  )
  expect(signalIntegritySignalProps.parse(signal.props).mask).toEqual({
    vih: 0.2,
    vil: -0.2,
  })
})

test.each([
  [1e-320, "1UI"],
  [1e308, "1e-20UI"],
] as const)(
  "rejects UI duration %s/%s that overflows or underflows seconds",
  (bitRate, duration) => {
    const block = (
      <signalintegrity.simulation bitRate={bitRate} duration={duration} />
    )
    const parsed = signalIntegritySimulationProps.safeParse(block.props)
    expect(parsed.success).toBe(false)
    if (!parsed.success)
      expect(parsed.error.issues[0]?.path).toEqual(["duration"])
  },
)

test("duration absence stays automatic and extracted PDN stays schema-valid", () => {
  const block = (
    <signalintegrity.simulation
      bitRate="20Mbps"
      pdn="extracted"
      duration={undefined}
    />
  )
  const parsed = signalIntegritySimulationProps.parse(block.props)
  expect(parsed.pdn).toBe("extracted")
  expect(parsed).not.toHaveProperty("duration")
})

test("removed supply has neither an authoring type nor a runtime alias", () => {
  // @ts-expect-error Rails come from the selected IBIS models at the test corner.
  const block = <signalintegrity.simulation bitRate="20Mbps" supply="ibis" />
  expect(signalIntegritySimulationProps.safeParse(block.props).success).toBe(
    false,
  )
  expect(
    signalIntegritySimulationProps.safeParse({
      ...block.props,
      supply: "board",
    }).success,
  ).toBe(false)
})

test.each(["1V", "garbage", "-1UI", -1, Infinity])(
  "rejects invalid duration/offset %j",
  (value) => {
    expect(
      signalIntegritySimulationProps.safeParse({
        bitRate: "20Mbps",
        duration: value,
      }).success,
    ).toBe(false)
    expect(
      signalIntegritySignalProps.safeParse({ ...data, offset: value }).success,
    ).toBe(false)
  },
)

test("duration must be positive and mask units must match their quantities", () => {
  expect(
    signalIntegritySimulationProps.safeParse({ bitRate: 20e6, duration: "0UI" })
      .success,
  ).toBe(false)
  expect(
    signalIntegritySimulationProps.safeParse({ bitRate: 20e6, duration: 0 })
      .success,
  ).toBe(false)
  for (const mask of [
    { vih: "1ns" },
    { setup: "75mV" },
    { hold: "0.25UI" },
    { vil: Infinity },
  ]) {
    expect(
      signalIntegritySignalProps.safeParse({ ...data, mask }).success,
    ).toBe(false)
  }
})

test("signal counts and literal bit patterns have no lane cap", () => {
  const { signals } = parseBlock(
    <signalintegrity.simulation bitRate="20Mbps">
      {Array.from({ length: 64 }, (_, i) => (
        <signalintegrity.signal
          key={i}
          name={`D${i}`}
          driverRef={`.TX > .D${i}`}
          receiverRef={`.RX > .D${i}`}
        />
      ))}
    </signalintegrity.simulation>,
  )
  expect(signals).toHaveLength(64)
  expect(
    signalIntegritySignalProps.parse({ ...data, pattern: "1".repeat(65537) })
      .pattern,
  ).toHaveLength(65537)
})

test("block rate is required and numerical extraction settings are not props", () => {
  expect(signalIntegritySimulationProps.safeParse({}).success).toBe(false)
  expect(
    signalIntegritySimulationProps.safeParse({ bitRate: 20e6, sections: 4 })
      .success,
  ).toBe(false)
  expect(
    signalIntegritySignalProps.safeParse({ ...data, termination: "120ohm" })
      .success,
  ).toBe(false)
})
