import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("accepts supported patterns", () => {
  for (const pattern of ["prbs7", "prbs15", "prbs31", "clock", "0011010"]) {
    expect(pcbChannelProps.parse({ ...data, pattern }).pattern).toBe(pattern)
  }
})
