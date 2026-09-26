import { expect, test } from "bun:test"
import { pcbPathPoint } from "lib/common/pcbPath"
import { traceProps, type TraceProps } from "lib/components/trace"

const taper = {
  x: 0,
  y: 0,
  startWidth: "600um",
  endWidth: "0.2mm",
  widthInterpolationMode: "quadratic" as const,
}

test("trace paths preserve taper fields and convert widths to millimeters", () => {
  const input: TraceProps = {
    from: "U1.1",
    to: "J1.1",
    pcbPath: [taper, "J1.1"],
    pcbPaths: [[taper, { x: 1, y: 0 }]],
  }
  const parsed = traceProps.parse(input)
  const expected = { ...taper, startWidth: 0.6, endWidth: 0.2 }
  expect(parsed.pcbPath).toEqual([expected, "J1.1"])
  expect(parsed.pcbPaths).toEqual([[expected, { x: 1, y: 0 }]])
})

test("both profiles allow narrowing, widening and constant width", () => {
  for (const widthInterpolationMode of ["linear", "quadratic"] as const) {
    for (const [startWidth, endWidth] of [
      [0.6, 0.2],
      [0.2, 0.6],
      [0.2, 0.2],
    ]) {
      const point = { x: 0, y: 0, startWidth, endWidth, widthInterpolationMode }
      expect(pcbPathPoint.parse(point)).toEqual(point)
    }
  }
})

test("ordinary points and vias keep their existing output without taper defaults", () => {
  for (const point of [
    { x: 0, y: 0 },
    { x: 1, y: 0, via: true, toLayer: "bottom" as const },
  ]) {
    expect(pcbPathPoint.parse(point)).toEqual(point)
  }
})

test("taper fields must be supplied together and cannot belong to a via", () => {
  for (const field of ["startWidth", "endWidth", "widthInterpolationMode"]) {
    expect(
      pcbPathPoint.safeParse({ ...taper, [field]: undefined }).success,
    ).toBe(false)
  }
  expect(
    pcbPathPoint.safeParse({ ...taper, via: true, toLayer: "bottom" }).success,
  ).toBe(false)
})

test("widths must be positive and finite and profiles must be supported", () => {
  for (const field of ["startWidth", "endWidth"]) {
    for (const value of [0, -1, Infinity, NaN, "-1mm"]) {
      expect(pcbPathPoint.safeParse({ ...taper, [field]: value }).success).toBe(
        false,
      )
    }
  }
  expect(
    pcbPathPoint.safeParse({ ...taper, widthInterpolationMode: "unsupported" })
      .success,
  ).toBe(false)
})
