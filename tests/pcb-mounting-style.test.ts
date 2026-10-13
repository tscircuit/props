import { expect, test } from "bun:test"
import { chipProps, type ChipProps } from "lib/components/chip"
import { resistorProps, type ResistorProps } from "lib/components/resistor"
import { commonComponentProps } from "lib/common/layout"

test("PCB mounting style is shared by normal components", () => {
  const chip: ChipProps = { name: "U1", pcbMountingStyle: "smt" }
  const resistor: ResistorProps = {
    name: "R1",
    resistance: "10k",
    pcbMountingStyle: "through_hole",
  }

  expect(chipProps.parse(chip).pcbMountingStyle).toBe("smt")
  expect(resistorProps.parse(resistor).pcbMountingStyle).toBe("through_hole")
})

test("omitted PCB mounting style preserves existing behavior", () => {
  expect(commonComponentProps.parse({ name: "U1" }).pcbMountingStyle).toBe(
    undefined,
  )
  expect(
    resistorProps.parse({ name: "R1", resistance: 1000 }).pcbMountingStyle,
  ).toBe(undefined)
})

test("SMT assembly intent does not restrict footprint geometry", () => {
  const parsed = chipProps.parse({
    name: "J1",
    footprint: "pinrow2",
    pcbMountingStyle: "smt",
  })

  expect(parsed.pcbMountingStyle).toBe("smt")
  expect(parsed.footprint).toBe("pinrow2")
})

test("rejects invalid PCB mounting styles without coercion", () => {
  for (const pcbMountingStyle of [true, false, null, "SMT", "auto", "smd"]) {
    expect(
      commonComponentProps.safeParse({ name: "U1", pcbMountingStyle }).success,
    ).toBe(false)
  }
})
