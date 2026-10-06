import { expect, test } from "bun:test"
import {
  pcbKeepoutProps,
  type PcbKeepoutProps,
} from "lib/components/pcb-keepout"

test("keepout permissions preserve booleans and omission across all shapes", () => {
  const keepouts = [
    { shape: "rect", width: 6, height: 6 },
    { shape: "circle", radius: 3 },
  ] satisfies PcbKeepoutProps[]
  for (const keepout of keepouts) {
    for (const field of ["allowTraces", "allowPlacements"] as const) {
      expect(pcbKeepoutProps.parse(keepout)).not.toHaveProperty(field)
      for (const value of [true, false]) {
        const input = { ...keepout, [field]: value }
        expect(pcbKeepoutProps.parse(input)).toHaveProperty(field, value)
      }
      for (const value of ["true", 1, null]) {
        expect(
          pcbKeepoutProps.safeParse({ ...keepout, [field]: value }).success,
        ).toBe(false)
      }
    }
    const combined = {
      ...keepout,
      allowTraces: true,
      allowPlacements: true,
      warningOnly: true,
    }
    expect(pcbKeepoutProps.parse(combined)).toMatchObject(combined)
  }
})
