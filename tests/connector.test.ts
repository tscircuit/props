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
