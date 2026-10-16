import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test.failing("symbol preserves opt-in uniform fitting and drawing-only bounds", () => {
  const parsed = symbolProps.parse({
    width: "2mm",
    height: "1.2mm",
    fit: "contain",
    sizeIncludesPorts: false,
  })
  expect(parsed).toMatchObject({
    width: 2,
    height: 1.2,
    fit: "contain",
    sizeIncludesPorts: false,
  })
})
