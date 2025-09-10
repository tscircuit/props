import { expect, test } from "bun:test"
import {
  copperPourProps,
  type CopperPourProps,
} from "lib/components/copper-pour"
import { expectTypeOf } from "expect-type"

test("should parse a valid copper pour", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.connectsTo).toBe("gnd")
  expect(parsed.layer).toBe("top")
})

test("type inference for CopperPourProps", () => {
  const props: CopperPourProps = {
    connectsTo: "gnd",
    layer: "bottom",
    padMargin: 1,
  }
  expectTypeOf(props).toMatchTypeOf<CopperPourProps>()
})
