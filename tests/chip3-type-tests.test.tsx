import type {
  ChipConnections,
  ChipPinLabels,
  ChipProps,
  ChipPropsSU,
  PinLabelFromPinLabelMap,
} from "lib"
import { expectTypesMatch } from "lib/typecheck"
import { test } from "bun:test"

const pinLabels1 = {
  pin1: "CUSTOM_DATA_1",
  pin2: "CUSTOM_DATA_2",
  pin3: "VCC",
  pin4: "GND",
} as const

const pinLabels2 = {
  pin1: ["CUSTOM_DATA_1", "GPIO1"],
  pin2: ["CUSTOM_DATA_2", "GPIO2"],
  pin3: ["VCC"],
  pin4: ["GND"],
} as const

const pinLabels3 = ["CUSTOM_DATA_1", "CUSTOM_DATA_2", "VCC", "GND"] as const

interface TscircuitElements {
  chip: ChipProps
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

test("[typetest] example chip props usage", () => {
  const A: PinLabelFromPinLabelMap<typeof pinLabels1> = "CUSTOM_DATA_1"
  const B: PinLabelFromPinLabelMap<typeof pinLabels2> = "CUSTOM_DATA_2"

  expectTypesMatch<
    PinLabelFromPinLabelMap<typeof pinLabels1>,
    "CUSTOM_DATA_1" | "CUSTOM_DATA_2" | "VCC" | "GND"
  >(true)

  expectTypesMatch<
    PinLabelFromPinLabelMap<typeof pinLabels2>,
    "CUSTOM_DATA_1" | "CUSTOM_DATA_2" | "VCC" | "GND" | "GPIO1" | "GPIO2"
  >(true)

  const MyChip1 = (props: ChipProps<typeof pinLabels1>) => <chip {...props} />

  const testChip1 = (
    <MyChip1
      name="U1"
      pinLabels={pinLabels1}
      connections={{
        CUSTOM_DATA_1: "...",

        // @ts-expect-error
        PIN_DOESNT_EXIST: "...",
      }}
    />
  )

  const MyChip2 = (props: ChipProps<typeof pinLabels2>) => <chip {...props} />

  const testChip2 = (
    <MyChip2
      name="U1"
      pinLabels={pinLabels2}
      connections={{
        CUSTOM_DATA_1: "...",
      }}
    />
  )

  const MyChip3 = (props: ChipProps<"MYPIN1" | "MYPIN2">) => <chip {...props} />

  const testChip3 = (
    <MyChip3
      name="U1"
      pinLabels={{
        pin1: "MYPIN1",
        pin2: "MYPIN2",

        // @ts-expect-error
        PIN_DOESNT_EXIST: "...",
      }}
      connections={{
        MYPIN1: ["...", "..."],

        // @ts-expect-error
        PIN_DOESNT_EXIST: "...",
      }}
    />
  )
})

test("[typetest] get connections type, get pin labels from Chip function", () => {
  const MyChip = (props: ChipProps<typeof pinLabels1>) => <chip {...props} />

  type MyChipPinLabels = ChipPinLabels<typeof MyChip>
  expectTypesMatch<
    MyChipPinLabels,
    "CUSTOM_DATA_1" | "CUSTOM_DATA_2" | "VCC" | "GND"
  >(true)

  const connections: ChipConnections<typeof MyChip> = {
    CUSTOM_DATA_1: "...",
    CUSTOM_DATA_2: "...",
    GND: "...",
    VCC: "...",
  }

  const connections2: ChipConnections<typeof MyChip> = {
    // @ts-expect-error
    DOES_NOT_EXIST: "...",
  }
})

test(`[typetest] ChipConnections<ChipProps<"custompin1" | "custompin2">>`, () => {
  const MyChip = (props: ChipProps<"custompin1" | "custompin2">) => (
    <chip {...props} />
  )

  type MyChipPinLabels = ChipPinLabels<typeof MyChip>
  type MyChipConnections = ChipConnections<typeof MyChip>
  expectTypesMatch<MyChipPinLabels, "custompin1" | "custompin2">(true)
  expectTypesMatch<
    MyChipConnections,
    { custompin1: string; custompin2: string }
  >(true)
})

test("[typetest] pinAttributes type matches pin labels", () => {
  const MyChip = (props: ChipProps<typeof pinLabels1>) => <chip {...props} />

  const element = (
    <MyChip
      name="U1"
      pinLabels={pinLabels1}
      pinAttributes={{
        VCC: { providesPower: true },
        GND: { requiresPower: true },
        // @ts-expect-error
        INVALID: { foo: true },
      }}
    />
  )
  void element
})

test("[typetest] connections can reference pin numbers", () => {
  const myPinLabels = {
    pin1: "A",
    pin2: "B",
  } as const

  const MyChip = (props: ChipProps<typeof myPinLabels>) => <chip {...props} />

  const byLabel = (
    <MyChip name="U1" pinLabels={myPinLabels} connections={{ A: "net.A" }} />
  )
  const byNumber = (
    <MyChip name="U1" pinLabels={myPinLabels} connections={{ pin2: "net.B" }} />
  )
  const invalid = (
    <MyChip
      name="U1"
      pinLabels={myPinLabels}
      connections={{
        // @ts-expect-error
        INVALID_PIN: "net.C",
      }}
    />
  )

  void byLabel
  void byNumber
  void invalid
})
