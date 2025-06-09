import { expect, test } from "bun:test"
import { netLabelProps, type NetLabelProps } from "../lib/components/netlabel"

// Basic parsing test

test("should parse net label props", () => {
  const raw: NetLabelProps = {
    net: "GND",
    connection: ".R1 > .pin1",
    schX: 10,
    schY: "5mm",
  }

  const parsed = netLabelProps.parse(raw)
  expect(parsed.net).toBe("GND")
  expect(parsed.connection).toBe(".R1 > .pin1")
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(5)
})
