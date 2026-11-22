import { expect, test } from "bun:test"
import pkg from "../package.json"

// The library uses Zod 3's `z.function().args(...)` API in
// lib/platformConfig.ts, which was removed in Zod 4. If the peer dependency
// range allows Zod 4, consumers installing `@tscircuit/props` resolve a Zod 4
// release and the built package throws at import time:
//   TypeError: z191.function(...).args is not a function
// See https://github.com/tscircuit/props/issues/1016
test("zod peer dependency is constrained to Zod 3", () => {
  const zodPeerRange = pkg.peerDependencies.zod
  expect(zodPeerRange).toBeDefined()

  // The declared range must not admit Zod 4. A bare "*", ">=3", or "^3 || ^4"
  // style range would let npm resolve zod@4.x, so we assert the range is
  // pinned to the 3.x major line.
  const admitsZod4 = (() => {
    // Reject any range that references a major >= 4 or an unbounded wildcard.
    if (zodPeerRange.includes("*")) return true
    // Extract all explicit major version numbers mentioned in the range.
    const majors = [...zodPeerRange.matchAll(/(\d+)\.\d+/g)].map((m) =>
      Number(m[1]),
    )
    // Any major >= 4 means Zod 4 is allowed.
    if (majors.some((major) => major >= 4)) return true
    // A bare major like "3" or "^3" is fine; anything without a 3 anchor is not.
    return !/(^|\D)3(\D|$)/.test(zodPeerRange)
  })()

  expect(admitsZod4).toBeFalse()
})