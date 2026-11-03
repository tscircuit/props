import { expect, test } from "bun:test"
import { copperPourProps } from "lib/components/copper-pour"

test("parses unit-aware clearance rules without inventing spacing or changing defaults", () => {
  const parsed = copperPourProps.parse({
    connectsTo: "net.GND",
    layer: "top",
    isStatic: true,
    clearanceRules: [
      {
        clearance: "60mil",
        netSelectors: ["net.HV"],
        objectTypes: ["via", "plated_hole"],
      },
    ],
  })
  expect(parsed.clearanceRules?.[0]?.clearance).toBeCloseTo(1.524)
  expect(parsed.clearanceRules?.[0]?.netSelectors).toEqual(["net.HV"])
  expect(parsed.isStatic).toBe(true)
  expect(
    copperPourProps.parse({ connectsTo: "net.GND", layer: "top" })
      .clearanceRules,
  ).toBeUndefined()
  expect(
    copperPourProps.safeParse({
      connectsTo: "net.GND",
      layer: "top",
      clearanceRules: [{ clearance: -1 }],
    }).success,
  ).toBe(false)
})
