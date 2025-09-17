import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

// Ensure traceProps allows arbitrary schStroke values

test("parses arbitrary schStroke and ratsNestColor on trace", () => {
  const raw: TraceProps = {
    from: "A",
    to: "B",
    schStroke: "green",
    ratsNestColor: "#123456",
  }
  const parsed = traceProps.parse(raw)
  expect(parsed.schStroke).toBe("green")
  expect(parsed.ratsNestColor).toBe("#123456")
})
