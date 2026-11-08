import { expect, test } from "bun:test"
import {
  copperPourProps,
  type CopperPourProps,
} from "lib/components/copper-pour"

test("floating-island removal is an explicit boolean and preserves existing defaults", () => {
  const props: CopperPourProps = {
    connectsTo: "net.GND",
    layer: "inner1",
    removeFloatingIslands: true,
  }
  expect(copperPourProps.parse(props).removeFloatingIslands).toBe(true)
  expect(
    copperPourProps.parse({ ...props, removeFloatingIslands: false })
      .removeFloatingIslands,
  ).toBe(false)
  expect(
    copperPourProps.parse({ connectsTo: "net.GND", layer: "inner1" })
      .removeFloatingIslands,
  ).toBeUndefined()
  expect(
    copperPourProps.safeParse({ ...props, removeFloatingIslands: "true" })
      .success,
  ).toBe(false)
})
