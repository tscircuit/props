import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("literal bit patterns have no length cap", () => {
  expect(
    pcbChannelProps.parse({ ...data, pattern: "1".repeat(65537) }).pattern,
  ).toHaveLength(65537)
})
