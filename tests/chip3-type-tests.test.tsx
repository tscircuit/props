import type { ChipProps, ChipPropsSU, PinLabelFromPinLabelMap } from "lib"
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
      pinLabels={{
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
      pinLabels={{
        CUSTOM_DATA_1: "...",
        GPIO1: "...",

        // @ts-expect-error
        PIN_DOESNT_EXIST: "...",
      }}
    />
  )

  const MyChip3 = (props: ChipProps<"MYPIN1" | "MYPIN2">) => <chip {...props} />

  const testChip3 = (
    <MyChip3
      name="U1"
      pinLabels={{
        MYPIN1: "...",
        MYPIN2: "...",

        // @ts-expect-error
        PIN_DOESNT_EXIST: "...",
      }}
    />
  )
})
