import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

test("trace import props preserve physical-only source connectivity", () => {
  const importedTrace: TraceProps = {
    from: ".U1 > .pin1",
    to: ".U2 > .pin1",
    noSchematicRepresentation: true,
    sourceTraceId: "source_trace_imported",
  }

  expect(traceProps.parse(importedTrace)).toMatchObject({
    noSchematicRepresentation: true,
    sourceTraceId: "source_trace_imported",
  })
  expect(
    traceProps.parse({ from: ".U1 > .pin1", to: ".U2 > .pin1" }),
  ).not.toHaveProperty("sourceTraceId")
  expect(
    traceProps.safeParse({ ...importedTrace, sourceTraceId: 42 }).success,
  ).toBe(false)
  expect(
    traceProps.safeParse({ ...importedTrace, noSchematicRepresentation: 1 })
      .success,
  ).toBe(false)
})
