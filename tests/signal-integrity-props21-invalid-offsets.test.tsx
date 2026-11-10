import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("rejects invalid offsets", () => {
  for (const value of ["1V", "garbage", "-1UI", -1, Infinity]) {
    expect(pcbChannelProps.safeParse({ ...data, offset: value }).success).toBe(
      false,
    )
  }
})
