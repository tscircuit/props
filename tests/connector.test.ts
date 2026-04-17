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
  expect(() =>
    connectorProps.parse({ name: "conn", standard: "invalid" } as any),
  ).toThrow()
})

test("should parse connector insertionDirection options", () => {
  const insertionDirections = [
    "from_above",
    "from_left",
    "from_right",
    "from_front",
    "from_back",
  ] as const

  for (const insertionDirection of insertionDirections) {
    const raw: ConnectorProps = { name: "conn", insertionDirection }
    const parsed = connectorProps.parse(raw)
    expect(parsed.insertionDirection).toBe(insertionDirection)
  }
})

test("should fail for invalid connector insertionDirection", () => {
  expect(() =>
    connectorProps.parse({
      name: "conn",
      insertionDirection: "from_side",
    } as any),
  ).toThrow()
})
