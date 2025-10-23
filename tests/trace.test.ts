import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

// Ensure traceProps allows arbitrary schStroke values

test("parses arbitrary schStroke and highlightColor on trace", () => {
  const raw: TraceProps = {
    from: "A",
    to: "B",
    schStroke: "green",
    highlightColor: "#123456",
  }
  const parsed = traceProps.parse(raw)
  expect(parsed.schStroke).toBe("green")
  expect(parsed.highlightColor).toBe("#123456")
})

test("accepts pin selector strings within pcbPath", () => {
  const raw: TraceProps = {
    from: "U1.1",
    to: "U1.2",
    pcbPath: ["U1.3", { x: 0, y: 0 }, "J1.1"],
  }

  const parsed = traceProps.parse(raw)

  expect(parsed.pcbPath).toEqual(["U1.3", { x: 0, y: 0 }, "J1.1"])
})
