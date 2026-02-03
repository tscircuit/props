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

test("accepts multiple pcbPaths", () => {
  const raw: TraceProps = {
    from: "U1.1",
    to: "U1.2",
    pcbPaths: [
      ["U1.3", { x: 0, y: 0 }, "J1.1"],
      [{ x: 1, y: 2 }, "J1.2", { x: 3, y: 4 }],
    ],
  }

  const parsed = traceProps.parse(raw)

  expect(parsed.pcbPaths).toEqual([
    ["U1.3", { x: 0, y: 0 }, "J1.1"],
    [{ x: 1, y: 2 }, "J1.2", { x: 3, y: 4 }],
  ])
})

test("accepts pcbPath via entries with toLayer", () => {
  const raw: TraceProps = {
    from: "U1.1",
    to: "U1.2",
    pcbPath: [
      { x: 0, y: 0 },
      { x: 1, y: 2, via: true, toLayer: "bottom" },
      { x: 3, y: 4 },
    ],
  }

  const parsed = traceProps.parse(raw)

  expect(parsed.pcbPath).toEqual([
    { x: 0, y: 0 },
    { x: 1, y: 2, via: true, toLayer: "bottom" },
    { x: 3, y: 4 },
  ])
})

test("supports pcbStraightLine flag", () => {
  const raw: TraceProps = {
    from: "A",
    to: "B",
    pcbStraightLine: true,
  }

  const parsed = traceProps.parse(raw)

  expect(parsed.pcbStraightLine).toBe(true)
})
