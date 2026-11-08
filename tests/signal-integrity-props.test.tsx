import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { Children, type Attributes, type ReactElement } from "react"
import type { z } from "zod"
import {
  signalIntegrityProps,
  signalProps,
  type SignalIntegrityProps,
  type SignalProps,
  type SignalEndpoint,
} from "../lib"

interface TscircuitElements {
  signalintegrity: SignalIntegrityProps
  signal: SignalProps & Attributes
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends TscircuitElements {}
  }
}
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends TscircuitElements {}
  }
}

function parseBlock(element: ReactElement<SignalIntegrityProps>) {
  return {
    block: signalIntegrityProps.parse(element.props),
    signals: Children.toArray(element.props.children).map((child) =>
      signalProps.parse((child as ReactElement<SignalProps>).props),
    ),
  }
}

test("Level 1 single-ended TSX supplies the RFC defaults", () => {
  const { block, signals } = parseBlock(
    <signalintegrity bitRate="20Mbps">
      <signal name="DATA" driver=".TX > .Y" receiver=".RX > .A" />
    </signalintegrity>,
  )
  expect(block).toMatchObject({
    bitRate: 20e6,
    corner: "typ",
    unlistedNets: "passive",
    unrouted: "error",
    pdn: "ideal",
  })
  expect(block).not.toHaveProperty("duration")
  expect(block).not.toHaveProperty("supply")
  expect(signals).toEqual([
    {
      name: "DATA",
      driver: ".TX > .Y",
      receiver: ".RX > .A",
      pattern: "prbs7",
      offset: "0UI",
      probe: "local",
      mask: "ibis",
    },
  ])
})

test("Level 1 differential TSX uses objects, and multi-drop arrays stay receivers", () => {
  const driver = { p: ".TX > .A", n: ".TX > .B" }
  const receiver = { p: ".RX > .A", n: ".RX > .B" }
  const { block, signals } = parseBlock(
    <signalintegrity bitRate="250kbps">
      <signal name="BUS" driver={driver} receiver={receiver} />
    </signalintegrity>,
  )
  expect(block.bitRate).toBe(250e3)
  expect(signals[0]).toMatchObject({ driver, receiver })

  const receivers = [
    receiver,
    { pin: receiver, model: "BUS_ODT" },
    ".RX3 > .A",
    ".RX4 > .A",
  ]
  const bus = (
    <signal
      name="BUS"
      driver={{ pin: driver, model: "BUS_DRIVE" }}
      receiver={receivers}
    />
  )
  expect(signalProps.parse(bus.props)).toMatchObject({
    driver: { pin: driver, model: "BUS_DRIVE" },
    receiver: receivers,
  })
  expect(
    signalProps.parse({ ...bus.props, receiver: [".RX > .A", ".RX > .B"] })
      .receiver,
  ).toEqual([".RX > .A", ".RX > .B"])
})

test.each(["low", "high", "off"] as const)(
  "quiet=%s declares a crosstalk victim",
  (quiet) => {
    const victim = (
      <signal name="D1" driver=".TX > .D1" receiver=".RX > .D1" quiet={quiet} />
    )
    expect(signalProps.parse(victim.props).quiet).toBe(quiet)
  },
)

test("RFC DDR3 write TSX supplies per-leg models, a strobe and normalized mask", () => {
  const { signals } = parseBlock(
    <signalintegrity
      name="WRITE"
      bitRate="800Mbps"
      corner="typ"
      pdn="ideal"
      unrouted="ideal"
    >
      <signal
        name="DQS"
        driver={{
          pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
          model: { p: "Model_579", n: "Model_771" },
        }}
        receiver={{
          pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
          model: { p: "ODT_off", n: "ODT_off" },
        }}
        pattern="clock"
        offset="0.5UI"
      />
      <signal
        name="DQ0"
        driver={{ pin: ".CPU > .DDR_D0", model: "Model_257" }}
        receiver={{ pin: ".DRAM > .DQL0", model: "ODT_off" }}
        strobe="DQS"
        mask={{ setup: "10ps", hold: "45ps" }}
      />
    </signalintegrity>,
  )
  expect(signals[0]).toMatchObject({
    pattern: "clock",
    offset: "0.5UI",
    driver: {
      pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
      model: { p: "Model_579", n: "Model_771" },
    },
    receiver: {
      pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
      model: { p: "ODT_off", n: "ODT_off" },
    },
  })
  expect(signals[1]).toMatchObject({
    strobe: "DQS",
    receiver: { pin: ".DRAM > .DQL0", model: "ODT_off" },
  })
  expect(signals[1]?.mask).toEqual({
    setup: 10e-12,
    hold: 45e-12,
  })
})

const data = { name: "DATA", driver: ".TX > .Y", receiver: ".RX > .A" }

test("authoring inputs and normalized outputs preserve their types", () => {
  expectTypeOf<z.input<typeof signalProps>>().toEqualTypeOf<SignalProps>()
  expectTypeOf<
    z.input<typeof signalIntegrityProps>
  >().toEqualTypeOf<SignalIntegrityProps>()
  expectTypeOf<
    z.output<typeof signalIntegrityProps>["duration"]
  >().toEqualTypeOf<number | undefined>()
  expectTypeOf<
    z.output<typeof signalIntegrityProps>["bitRate"]
  >().toEqualTypeOf<number>()
  // @ts-expect-error Per-leg models require a differential pin pair.
  const single: SignalEndpoint = { pin: ".TX > .Y", model: { p: "P", n: "N" } }
  expect(signalProps.safeParse({ ...data, driver: single }).success).toBe(false)
})

test("bare quiet and boolean quiet report the RFC diagnostic", () => {
  // @ts-expect-error A bare quiet attribute is boolean, not a level.
  const bare = <signal {...data} quiet />
  for (const props of [
    bare.props,
    { ...data, quiet: true },
    { ...data, quiet: false },
  ]) {
    const parsed = signalProps.safeParse(props)
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
  // @ts-expect-error An array is never a differential driver.
  const arrayDriver = <signal {...data} driver={[".TX > .P", ".TX > .N"]} />
  expect(signalProps.safeParse(arrayDriver.props).success).toBe(false)
  for (const driver of [
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
    expect(signalProps.safeParse({ ...data, driver }).success).toBe(false)
  }
  expect(signalProps.safeParse({ ...data, receiver: [] }).success).toBe(false)
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
          <signal {...data} pattern={pattern} seed={seed} quiet={quiet} />
        )
        expect(signalProps.parse(signal.props).seed).toBe(seed)
      }
      for (const seed of [0, -1, 0.5, 1.5, max + 1, NaN, Infinity, -Infinity]) {
        const signal = (
          <signal {...data} pattern={pattern} seed={seed} quiet={quiet} />
        )
        const parsed = signalProps.safeParse(signal.props)
        expect(parsed.success).toBe(false)
        if (!parsed.success)
          expect(parsed.error.issues[0]?.path).toEqual(["seed"])
      }
    }
    const signal = <signal {...data} pattern={pattern} />
    expect(signalProps.parse(signal.props)).not.toHaveProperty("seed")
  },
)

test.each(["prbs7", "prbs15", "prbs31", "clock", "0011010"])(
  "accepts pattern %s",
  (pattern) => {
    expect(signalProps.parse({ ...data, pattern }).pattern).toBe(pattern)
  },
)

test.each(["prbs9", "", "012", "random", 101, { type: "prbs7" }])(
  "rejects unknown pattern %j",
  (pattern) => {
    expect(signalProps.safeParse({ ...data, pattern }).success).toBe(false)
  },
)

test.each([
  ["20Mbps", 20e6],
  ["250kbps", 250e3],
  [20e6, 20e6],
  ["1.6Gbps", 1.6e9],
  ["2e7bit/s", 20e6],
] as const)("parses bit rate %s as bit/s", (bitRate, expected) => {
  expect(signalIntegrityProps.parse({ bitRate }).bitRate).toBe(expected)
  expect(signalProps.parse({ ...data, bitRate }).bitRate).toBe(expected)
})

test.each([0, -1, Infinity, NaN, "20MHz", "20MBps", "garbage"])(
  "rejects invalid bit rate %j",
  (bitRate) => {
    expect(signalIntegrityProps.safeParse({ bitRate }).success).toBe(false)
    expect(signalProps.safeParse({ ...data, bitRate }).success).toBe(false)
  },
)

test("times parse to seconds and UI offsets retain their relative units", () => {
  expect(
    signalIntegrityProps.parse({ bitRate: "20Mbps", duration: "2us" }).duration,
  ).toBe(2e-6)
  expect(
    signalIntegrityProps.parse({ bitRate: "20Mbps", duration: "32UI" })
      .duration,
  ).toBe(32 / 20e6)
  expect(
    signalIntegrityProps.parse({ bitRate: 20e6, duration: 2 }).duration,
  ).toBe(2)
  expect(signalProps.parse({ ...data, offset: "2ns" }).offset).toBe(2e-9)
  expect(signalProps.parse({ ...data, offset: " 0.250 UI " }).offset).toBe(
    "0.25UI",
  )
  expect(signalProps.parse({ ...data, offset: 0.25 }).offset).toBe(0.25)
  expect(
    signalProps.parse({
      ...data,
      mask: { vih: 1.2, vil: -0.1, setup: 75e-12, hold: 0 },
    }).mask,
  ).toEqual({ vih: 1.2, vil: -0.1, setup: 75e-12, hold: 0 })
})

test("setup/hold schema permits core to report the missing-strobe diagnostic", () => {
  expect(
    signalProps.parse({ ...data, mask: { setup: "75ps", hold: "100ps" } })
      .strobe,
  ).toBeUndefined()
})

test.each(["setup", "hold"] as const)(
  "mask.%s is finite and nonnegative",
  (field) => {
    for (const value of [-1e-10, "-75ps", Infinity, -Infinity, NaN]) {
      const signal = <signal {...data} strobe="DQS" mask={{ [field]: value }} />
      expect(signalProps.safeParse(signal.props).success).toBe(false)
    }
    for (const value of [0, "0ps", "75ps"]) {
      const signal = <signal {...data} strobe="DQS" mask={{ [field]: value }} />
      expect(signalProps.safeParse(signal.props).success).toBe(true)
    }
  },
)

test("mask voltages retain signed differential thresholds", () => {
  const signal = <signal {...data} mask={{ vih: "200mV", vil: "-200mV" }} />
  expect(signalProps.parse(signal.props).mask).toEqual({ vih: 0.2, vil: -0.2 })
})

test.each([
  [1e-320, "1UI"],
  [1e308, "1e-20UI"],
] as const)(
  "rejects UI duration %s/%s that overflows or underflows seconds",
  (bitRate, duration) => {
    const block = <signalintegrity bitRate={bitRate} duration={duration} />
    const parsed = signalIntegrityProps.safeParse(block.props)
    expect(parsed.success).toBe(false)
    if (!parsed.success)
      expect(parsed.error.issues[0]?.path).toEqual(["duration"])
  },
)

test("duration absence stays automatic and extracted PDN stays schema-valid", () => {
  const block = (
    <signalintegrity bitRate="20Mbps" pdn="extracted" duration={undefined} />
  )
  const parsed = signalIntegrityProps.parse(block.props)
  expect(parsed.pdn).toBe("extracted")
  expect(parsed).not.toHaveProperty("duration")
})

test("removed supply has neither an authoring type nor a runtime alias", () => {
  // @ts-expect-error Rails come from the selected IBIS models at the test corner.
  const block = <signalintegrity bitRate="20Mbps" supply="ibis" />
  expect(signalIntegrityProps.safeParse(block.props).success).toBe(false)
  expect(
    signalIntegrityProps.safeParse({ ...block.props, supply: "board" }).success,
  ).toBe(false)
})

test.each(["1V", "garbage", "-1UI", -1, Infinity])(
  "rejects invalid duration/offset %j",
  (value) => {
    expect(
      signalIntegrityProps.safeParse({ bitRate: "20Mbps", duration: value })
        .success,
    ).toBe(false)
    expect(signalProps.safeParse({ ...data, offset: value }).success).toBe(
      false,
    )
  },
)

test("duration must be positive and mask units must match their quantities", () => {
  expect(
    signalIntegrityProps.safeParse({ bitRate: 20e6, duration: "0UI" }).success,
  ).toBe(false)
  expect(
    signalIntegrityProps.safeParse({ bitRate: 20e6, duration: 0 }).success,
  ).toBe(false)
  for (const mask of [
    { vih: "1ns" },
    { setup: "75mV" },
    { hold: "0.25UI" },
    { vil: Infinity },
  ]) {
    expect(signalProps.safeParse({ ...data, mask }).success).toBe(false)
  }
})

test("signal counts and literal bit patterns have no lane cap", () => {
  const { signals } = parseBlock(
    <signalintegrity bitRate="20Mbps">
      {Array.from({ length: 64 }, (_, i) => (
        <signal
          key={i}
          name={`D${i}`}
          driver={`.TX > .D${i}`}
          receiver={`.RX > .D${i}`}
        />
      ))}
    </signalintegrity>,
  )
  expect(signals).toHaveLength(64)
  expect(
    signalProps.parse({ ...data, pattern: "1".repeat(65537) }).pattern,
  ).toHaveLength(65537)
})

test("block rate is required and numerical extraction settings are not props", () => {
  expect(signalIntegrityProps.safeParse({}).success).toBe(false)
  expect(
    signalIntegrityProps.safeParse({ bitRate: 20e6, sections: 4 }).success,
  ).toBe(false)
  expect(
    signalProps.safeParse({ ...data, termination: "120ohm" }).success,
  ).toBe(false)
})
