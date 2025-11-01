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
  expect(parsed.coveredWithSolderMask).toBe(false)
})

test("type inference for CopperPourProps", () => {
  const props: CopperPourProps = {
    connectsTo: "gnd",
    layer: "bottom",
    padMargin: 1,
    coveredWithSolderMask: true,
  }
  expectTypeOf(props).toMatchTypeOf<CopperPourProps>()
})

test("should parse coveredWithSolderMask when true", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    coveredWithSolderMask: true,
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.coveredWithSolderMask).toBe(true)
})
