import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts only positive finite pack solver timeouts", () => {
  expect(
    platformConfig.parse({ packSolverTimeoutMs: 5_000 }).packSolverTimeoutMs,
  ).toBe(5_000)

  expect(() => platformConfig.parse({ packSolverTimeoutMs: 0 })).toThrow()
  expect(() => platformConfig.parse({ packSolverTimeoutMs: -1 })).toThrow()
  expect(() =>
    platformConfig.parse({ packSolverTimeoutMs: Number.POSITIVE_INFINITY }),
  ).toThrow()
})
