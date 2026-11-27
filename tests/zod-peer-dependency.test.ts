import { expect, test } from "bun:test"
import { resistorProps } from "lib/components/resistor"
import pkg from "../package.json"

test("peerDependencies.zod constrains consumers to Zod v3", () => {
  const zodPeerRange = pkg.peerDependencies.zod
  expect(Bun.semver.satisfies("3.25.67", zodPeerRange)).toBe(true)
  expect(Bun.semver.satisfies("4.0.0", zodPeerRange)).toBe(false)

  const parsed = resistorProps.parse({ name: "R1", resistance: "10k" })
  expect(parsed.resistance).toBe(10000)
})
