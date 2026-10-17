import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test("symbol accepts the explicit stretch fit mode", () => {
  expect(symbolProps.parse({ width: "2mm", fit: "stretch" })).toMatchObject({
    width: 2,
    fit: "stretch",
  })
})
