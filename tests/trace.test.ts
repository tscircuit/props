import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

// Ensure traceProps allows arbitrary schStroke values

test("parses arbitrary schStroke on trace", () => {
  const raw: TraceProps = { from: "A", to: "B", schStroke: "green" }
  const parsed = traceProps.parse(raw)
  expect(parsed.schStroke).toBe("green")
})
