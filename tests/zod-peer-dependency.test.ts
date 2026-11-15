import { expect, test } from "bun:test"
import { resistorProps } from "lib/index"
import packageJson from "../package.json"

test("peerDependencies.zod constrains consumers to Zod 3", () => {
  const zodPeerRange = packageJson.peerDependencies.zod

  expect(Bun.semver.satisfies("3.23.8", zodPeerRange)).toBe(true)
  expect(Bun.semver.satisfies("3.25.76", zodPeerRange)).toBe(true)
  expect(Bun.semver.satisfies("4.0.0", zodPeerRange)).toBe(false)
  expect(Bun.semver.satisfies("4.6.7", zodPeerRange)).toBe(false)

  expect(resistorProps.parse({ name: "R1", resistance: "10k" })).toEqual({
    name: "R1",
    resistance: 10000,
  })
})
