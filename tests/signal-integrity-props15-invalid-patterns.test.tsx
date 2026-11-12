import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("rejects blank and non-string patterns", () => {
  for (const pattern of ["", " \t\n ", 101, { type: "prbs7" }]) {
    expect(pcbChannelProps.safeParse({ ...data, pattern }).success).toBe(false)
  }
})
