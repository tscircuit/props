import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts only positive finite pack solver timeouts", () => {
  expect(
    platformConfig.parse({ pcbPackSolverTimeoutMs: 5_000 })
      .pcbPackSolverTimeoutMs,
  ).toBe(5_000)

  expect(() => platformConfig.parse({ pcbPackSolverTimeoutMs: 0 })).toThrow()
  expect(() => platformConfig.parse({ pcbPackSolverTimeoutMs: -1 })).toThrow()
  expect(() =>
    platformConfig.parse({
      pcbPackSolverTimeoutMs: Number.POSITIVE_INFINITY,
    }),
  ).toThrow()
})
