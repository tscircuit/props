import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("rejects unknown patterns", () => {
  for (const pattern of [
    "prbs9",
    "",
    "012",
    "random",
    101,
    { type: "prbs7" },
  ]) {
    expect(pcbChannelProps.safeParse({ ...data, pattern }).success).toBe(false)
  }
})
