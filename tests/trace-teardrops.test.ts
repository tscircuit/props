import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

test("teardrop booleans preserve explicit endpoint overrides for all connection forms", () => {
  for (const connection of [
    { from: "U1.1", to: "J1.1" },
    { path: ["U1.1", "J1.1"] },
  ]) {
    for (const pcbTeardrops of [true, false, undefined]) {
      for (const pcbTeardropStart of [true, false, undefined]) {
        for (const pcbTeardropEnd of [true, false, undefined]) {
          const input: TraceProps = {
            ...connection,
            pcbTeardrops,
            pcbTeardropStart,
            pcbTeardropEnd,
            pcbPath: [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
            ],
          }
          const parsed = traceProps.parse(input)
          expect(parsed.pcbTeardrops).toBe(pcbTeardrops)
          expect(parsed.pcbTeardropStart).toBe(pcbTeardropStart)
          expect(parsed.pcbTeardropEnd).toBe(pcbTeardropEnd)
        }
      }
    }
  }
})

test("teardrop props reject non-booleans and introduce no defaults", () => {
  const connection = { from: "U1.1", to: "J1.1" }
  const parsed = traceProps.parse(connection)
  for (const prop of [
    "pcbTeardrops",
    "pcbTeardropStart",
    "pcbTeardropEnd",
  ] as const) {
    expect(parsed).not.toHaveProperty(prop)
    for (const value of ["yes", 1, null]) {
      expect(
        traceProps.safeParse({ ...connection, [prop]: value }).success,
      ).toBe(false)
    }
  }
})
