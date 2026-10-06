import { expect, test } from "bun:test"
import { copperPourProps, type CopperPourProps } from "lib"

test("crosshatch accepts only booleans and preserves omitted solid-fill behavior", () => {
  const pour = {
    layer: "bottom",
    connectsTo: "net.GND",
  } satisfies CopperPourProps

  expect(copperPourProps.parse(pour).crosshatch).toBeUndefined()
  for (const crosshatch of [true, false]) {
    expect(copperPourProps.parse({ ...pour, crosshatch }).crosshatch).toBe(
      crosshatch,
    )
  }
  for (const crosshatch of ["true", "false", 0, 1, null, {}]) {
    expect(copperPourProps.safeParse({ ...pour, crosshatch }).success).toBe(
      false,
    )
  }
})
