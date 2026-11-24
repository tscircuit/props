import { expect, test } from "bun:test"
import {
  boardProps,
  groupProps,
  partsEngine,
  platformConfig,
  subcircuitProps,
} from "lib/index"

test("partsEngine.safeParse rejects null and primitive inputs without throwing TypeError", () => {
  for (const invalid of [null, undefined, "parts", 123, false]) {
    expect(() => partsEngine.safeParse(invalid)).not.toThrow()
    expect(partsEngine.safeParse(invalid).success).toBe(false)
  }

  expect(partsEngine.safeParse({ findPart: "not-a-function" }).success).toBe(
    false,
  )
})

test("groupProps, subcircuitProps, boardProps, and platformConfig safely reject invalid partsEngine values", () => {
  for (const invalid of [null, "bad", 42]) {
    expect(() =>
      groupProps.safeParse({ subcircuit: true, partsEngine: invalid }),
    ).not.toThrow()
    expect(
      groupProps.safeParse({ subcircuit: true, partsEngine: invalid }).success,
    ).toBe(false)

    expect(() =>
      subcircuitProps.safeParse({ partsEngine: invalid }),
    ).not.toThrow()
    expect(subcircuitProps.safeParse({ partsEngine: invalid }).success).toBe(
      false,
    )

    expect(() => boardProps.safeParse({ partsEngine: invalid })).not.toThrow()
    expect(boardProps.safeParse({ partsEngine: invalid }).success).toBe(false)

    expect(() =>
      platformConfig.safeParse({ partsEngine: invalid }),
    ).not.toThrow()
    expect(platformConfig.safeParse({ partsEngine: invalid }).success).toBe(
      false,
    )
  }
})

test("partsEngine accepts valid PartsEngine implementations", () => {
  const validEngine = {
    findPart: async () => ({}),
  }

  expect(partsEngine.safeParse(validEngine).success).toBe(true)
  expect(
    groupProps.safeParse({ subcircuit: true, partsEngine: validEngine })
      .success,
  ).toBe(true)
  expect(platformConfig.safeParse({ partsEngine: validEngine }).success).toBe(
    true,
  )
})
