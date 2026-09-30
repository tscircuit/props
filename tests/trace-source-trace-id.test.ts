import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

test("sourceTraceId preserves an explicitly imported trace identity", () => {
  const importedTrace: TraceProps = {
    from: ".U1 > .pin1",
    to: ".U2 > .pin1",
    sourceTraceId: "source_trace_imported",
  }

  expect(traceProps.parse(importedTrace).sourceTraceId).toBe(
    "source_trace_imported",
  )
  expect(
    traceProps.parse({ from: ".U1 > .pin1", to: ".U2 > .pin1" }),
  ).not.toHaveProperty("sourceTraceId")
  expect(
    traceProps.safeParse({ ...importedTrace, sourceTraceId: 42 }).success,
  ).toBe(false)
})
