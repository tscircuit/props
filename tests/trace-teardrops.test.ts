import { expect, test } from "bun:test"
import { traceProps, type TraceProps } from "lib/components/trace"

test("pcbTeardrops is an optional trace-level boolean for all connection forms", () => {
  for (const connection of [
    { from: "U1.1", to: "J1.1" },
    { path: ["U1.1", "J1.1"] },
  ]) {
    for (const pcbTeardrops of [true, false, undefined]) {
      const input: TraceProps = {
        ...connection,
        pcbTeardrops,
        pcbPath: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
      }
      expect(traceProps.parse(input).pcbTeardrops).toBe(pcbTeardrops)
    }
  }
  expect(
    traceProps.safeParse({ from: "U1.1", to: "J1.1", pcbTeardrops: "yes" })
      .success,
  ).toBe(false)
})
