import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

// Ensure traceProps allows arbitrary schStroke values

test("parses arbitrary schStroke on trace", () => {
  const raw: TraceProps = { from: "A", to: "B", schStroke: "green" }
  const parsed = traceProps.parse(raw)
  expect(parsed.schStroke).toBe("green")
})

// Test color properties
test("parses color property on trace", () => {
  const raw: TraceProps = { from: "A", to: "B", color: "#ff0000" }
  const parsed = traceProps.parse(raw)
  expect(parsed.color).toBe("#ff0000")
})

test("parses schematicColor property on trace", () => {
  const raw: TraceProps = { from: "A", to: "B", schematicColor: "#00ff00" }
  const parsed = traceProps.parse(raw)
  expect(parsed.schematicColor).toBe("#00ff00")
})

test("parses pcbColor property on trace", () => {
  const raw: TraceProps = { from: "A", to: "B", pcbColor: "#0000ff" }
  const parsed = traceProps.parse(raw)
  expect(parsed.pcbColor).toBe("#0000ff")
})

test("parses all color properties together on trace", () => {
  const raw: TraceProps = { 
    from: "A", 
    to: "B", 
    color: "#ff0000",
    schematicColor: "#00ff00",
    pcbColor: "#0000ff"
  }
  const parsed = traceProps.parse(raw)
  expect(parsed.color).toBe("#ff0000")
  expect(parsed.schematicColor).toBe("#00ff00")
  expect(parsed.pcbColor).toBe("#0000ff")
})

test("color properties are optional", () => {
  const raw: TraceProps = { from: "A", to: "B" }
  const parsed = traceProps.parse(raw)
  expect(parsed.color).toBeUndefined()
  expect(parsed.schematicColor).toBeUndefined()
  expect(parsed.pcbColor).toBeUndefined()
})