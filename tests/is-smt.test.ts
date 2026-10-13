import { expect, test } from "bun:test"
import { chipProps, type ChipProps } from "lib/components/chip"
import { resistorProps, type ResistorProps } from "lib/components/resistor"
import { commonComponentProps } from "lib/common/layout"

test("isSmt is shared by normal components", () => {
  const chip: ChipProps = { name: "U1", isSmt: true }
  const resistor: ResistorProps = {
    name: "R1",
    resistance: "10k",
    isSmt: false,
  }

  expect(chipProps.parse(chip).isSmt).toBe(true)
  expect(resistorProps.parse(resistor).isSmt).toBe(false)
})

test("omitted isSmt remains undefined for core inference", () => {
  expect(commonComponentProps.parse({ name: "U1" }).isSmt).toBe(undefined)
  expect(resistorProps.parse({ name: "R1", resistance: 1000 }).isSmt).toBe(
    undefined,
  )
})

test("SMT assembly intent does not restrict footprint geometry", () => {
  const parsed = chipProps.parse({
    name: "J1",
    footprint: "pinrow2",
    isSmt: true,
  })

  expect(parsed.isSmt).toBe(true)
  expect(parsed.footprint).toBe("pinrow2")
})

test("rejects invalid isSmt values without coercion", () => {
  for (const isSmt of [null, "true", "false", "smt", 0, 1]) {
    expect(commonComponentProps.safeParse({ name: "U1", isSmt }).success).toBe(
      false,
    )
  }
})
