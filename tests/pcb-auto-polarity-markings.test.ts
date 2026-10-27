import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { capacitorProps, type CapacitorProps } from "lib/components/capacitor"
import { diodeProps, type DiodeProps } from "lib/components/diode"
import { ledProps, type LedProps } from "lib/components/led"
import type { z } from "zod"

test("polarized component authoring controls automatic PCB polarity notes independently of electrical polarity", () => {
  expectTypeOf<LedProps["pcbAutoPolarityMarkings"]>().toEqualTypeOf<
    boolean | undefined
  >()
  expectTypeOf<DiodeProps["pcbAutoPolarityMarkings"]>().toEqualTypeOf<
    boolean | undefined
  >()
  expectTypeOf<CapacitorProps["pcbAutoPolarityMarkings"]>().toEqualTypeOf<
    boolean | undefined
  >()
  expectTypeOf<
    z.output<typeof ledProps>["pcbAutoPolarityMarkings"]
  >().toEqualTypeOf<boolean>()
  expectTypeOf<
    z.output<typeof diodeProps>["pcbAutoPolarityMarkings"]
  >().toEqualTypeOf<boolean>()
  expectTypeOf<
    z.output<typeof capacitorProps>["pcbAutoPolarityMarkings"]
  >().toEqualTypeOf<boolean>()

  for (const [schema, props] of [
    [ledProps, { name: "LED1" }],
    [diodeProps, { name: "D1" }],
    [capacitorProps, { name: "C1", capacitance: "10uF", polarized: true }],
  ] as const) {
    expect(schema.parse(props).pcbAutoPolarityMarkings).toBe(true)
    expect(
      schema.parse({ ...props, pcbAutoPolarityMarkings: undefined })
        .pcbAutoPolarityMarkings,
    ).toBe(true)
    for (const pcbAutoPolarityMarkings of [true, false]) {
      expect(
        schema.parse({ ...props, pcbAutoPolarityMarkings })
          .pcbAutoPolarityMarkings,
      ).toBe(pcbAutoPolarityMarkings)
    }
    for (const pcbAutoPolarityMarkings of ["true", "false", 0, 1, null, {}]) {
      expect(
        schema.safeParse({ ...props, pcbAutoPolarityMarkings }).success,
      ).toBe(false)
    }
  }

  const capacitor = capacitorProps.parse({ name: "C2", capacitance: "100nF" })
  expect(capacitor.polarized).toBe(false)
  expect(capacitor.pcbAutoPolarityMarkings).toBe(true)
  const disabled = capacitorProps.parse({
    name: "C3",
    capacitance: "10uF",
    polarized: true,
    pcbAutoPolarityMarkings: false,
  })
  expect(disabled.polarized).toBe(true)
  expect(disabled.pcbAutoPolarityMarkings).toBe(false)
})
