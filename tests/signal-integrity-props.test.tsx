import { expect, test } from "bun:test"
import { Children, type Attributes, type ReactElement } from "react"
import {
  signalIntegrityProps,
  signalProps,
  type SignalIntegrityProps,
  type SignalProps,
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
    pdn: "extracted",
    supply: "board",
  })
  expect(block.duration).toBeUndefined()
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

test("DDR TSX supplies a strobe and mask with normalized units", () => {
  const { signals } = parseBlock(
    <signalintegrity
      name="WRITE"
      bitRate="1600Mbps"
      corner="min"
      supply="ibis"
      pdn="ideal"
      unrouted="ideal"
    >
      <signal
        name="DQS"
        driver={{ p: ".MC > .DQS0_P", n: ".MC > .DQS0_N" }}
        receiver={{ p: ".DRAM > .DQS_P", n: ".DRAM > .DQS_N" }}
        pattern="clock"
      />
      <signal
        name="DQ0"
        driver=".MC > .DQ0"
        receiver={{ pin: ".DRAM > .DQ0", model: "DQ_40_ODT40_1600" }}
        strobe="DQS"
        mask={{ vih: "1.2V", vil: "800mV", setup: "75ps", hold: "100ps" }}
      />
    </signalintegrity>,
  )
  expect(signals[0]?.pattern).toBe("clock")
  expect(signals[1]).toMatchObject({
    strobe: "DQS",
    receiver: { pin: ".DRAM > .DQ0", model: "DQ_40_ODT40_1600" },
  })
  expect(signals[1]?.mask).toEqual({
    vih: 1.2,
    vil: 0.8,
    setup: 75e-12,
    hold: 100e-12,
  })
})

const data = { name: "DATA", driver: ".TX > .Y", receiver: ".RX > .A" }

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
  ]) {
    expect(signalProps.safeParse({ ...data, driver }).success).toBe(false)
  }
  expect(signalProps.safeParse({ ...data, receiver: [] }).success).toBe(false)
})

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
