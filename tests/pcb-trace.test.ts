import { expect, test } from "bun:test"
import { pcbTraceProps } from "lib/components/pcb-trace"

const route = [
  { route_type: "wire" as const, x: 0, y: 0, width: 0.2, layer: "top" },
  { route_type: "wire" as const, x: 2, y: 0, width: 0.2, layer: "top" },
]

test("PCB traces accept one net selector", () => {
  expect(pcbTraceProps.parse({ route, connectsTo: "net.GND" }).connectsTo).toBe(
    "net.GND",
  )
  expect(() =>
    pcbTraceProps.parse({ route, connectsTo: ["net.GND", "net.VCC"] }),
  ).toThrow()
})
