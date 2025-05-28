import { expect, test } from "bun:test"
import { connectorProps, type ConnectorProps } from "lib/components/connector"

test("should parse connector with usb_c standard", () => {
  const raw: ConnectorProps = { name: "conn", standard: "usb_c" }
  const parsed = connectorProps.parse(raw)
  expect(parsed.standard).toBe("usb_c")
})

test("should parse connector with m2 standard", () => {
  const raw: ConnectorProps = { name: "conn", standard: "m2" }
  const parsed = connectorProps.parse(raw)
  expect(parsed.standard).toBe("m2")
})

test("should parse connector without standard", () => {
  const raw: ConnectorProps = { name: "conn" }
  const parsed = connectorProps.parse(raw)
  expect(parsed.standard).toBeUndefined()
})

test("should fail for invalid connector standard", () => {
  expect(() => connectorProps.parse({ name: "conn", standard: "invalid" } as any)).toThrow()
})
