import { expect, test } from "bun:test"
import { busProps } from "../lib/components/bus"
import { differentialPairProps } from "../lib/components/differentialpair"
test("generic constraints normalize physical units with no implicit rule limits", () => {
  const constraints = {
    expectedTraceCount: 2,
    lengthBounds: {
      referenceBus: "REFERENCE",
      referenceMetric: "longest_manhattan",
      min: "-5mil",
      max: "25mil",
    },
    spacing: [
      {
        otherBus: "NEIGHBOUR",
        centerlineWidthMultiplier: 4,
        reducedCenterlineWidthMultiplier: 1,
      },
    ],
    maxReducedSpacingLength: "1250mil",
    impedanceBounds: { min: "100ohm", max: "150ohm" },
  }
  const parsed = busProps.parse({
    connections: ["A", "B"],
    pcbRoutingConstraints: constraints,
  })
  expect(parsed.pcbRoutingConstraints).toMatchObject({
    expectedTraceCount: 2,
    lengthBounds: { min: -0.127, max: 0.635 },
    maxReducedSpacingLength: 31.75,
    impedanceBounds: { min: 100, max: 150 },
  })
  expect(
    differentialPairProps.parse({
      positiveConnection: "A",
      negativeConnection: "B",
      pcbRoutingConstraints: constraints,
    }).pcbRoutingConstraints,
  ).toEqual(parsed.pcbRoutingConstraints)
  expect(
    busProps.parse({ connections: ["A"] }).pcbRoutingConstraints,
  ).toBeUndefined()
})
test("invalid or incomplete constraints are rejected", () => {
  for (const pcbRoutingConstraints of [
    { expectedTraceCount: 0 },
    { lengthBounds: { min: 20, max: 10 } },
    { lengthBounds: { max: -1 } },
    { lengthBounds: { referenceBus: "OTHER", max: 0 } },
    { lengthBounds: { referenceMetric: "longest_manhattan", max: 0 } },
    { maxReducedSpacingLength: 5 },
    {
      spacing: [
        {
          otherBus: "OTHER",
          centerlineWidthMultiplier: 3,
          reducedCenterlineWidthMultiplier: 4,
        },
      ],
    },
    { impedanceBounds: { min: "75ohm", max: "50ohm" } },
  ])
    expect(
      busProps.safeParse({ connections: ["A"], pcbRoutingConstraints }).success,
    ).toBe(false)
})
