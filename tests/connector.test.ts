import { expect, test } from "bun:test"
import {
  connectorProps,
  connectorStandard,
  type ConnectorProps,
} from "lib/components/connector"

for (const standard of connectorStandard.options) {
  test(`should parse connector with ${standard} standard`, () => {
    const raw: ConnectorProps = { name: "conn", standard }
    const parsed = connectorProps.parse(raw)
    expect(parsed.standard).toBe(standard)
  })
}

test("should parse connector without standard", () => {
  const raw: ConnectorProps = { name: "conn" }
  const parsed = connectorProps.parse(raw)
  expect(parsed.standard).toBeUndefined()
})

test("should fail for invalid connector standard", () => {
  expect(() =>
    connectorProps.parse({ name: "conn", standard: "invalid" } as any),
  ).toThrow()
})

test("should reject a contradictory JST family and pitch", () => {
  expect(() =>
    connectorProps.parse({ name: "conn", standard: "jst_sh_2mm" } as any),
  ).toThrow()
})

test("should parse an optional connector pin count", () => {
  const raw: ConnectorProps = {
    name: "conn",
    standard: "jst_ph",
    pinCount: 2,
  }
  const parsed = connectorProps.parse(raw)
  expect(parsed.pinCount).toBe(2)
})

for (const pinCount of [0, -1, 2.5, Number.POSITIVE_INFINITY]) {
  test(`should reject invalid connector pin count ${pinCount}`, () => {
    expect(() => connectorProps.parse({ name: "conn", pinCount })).toThrow()
  })
}
