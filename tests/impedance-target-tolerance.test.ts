import { expect, test } from "bun:test"
import { busProps } from "lib/components/bus"
import { differentialPairProps } from "lib/components/differentialpair"

test("XML-friendly impedance tolerance expands into flat ohm props", () => {
  for (const targetImpedance of ["50±25ohm", "50ohm ± 25ohm", "50 +/- 25ohm"]) {
    expect(busProps.parse({ connections: ["A"], targetImpedance })).toEqual({
      connections: ["A"],
      targetImpedance: 50,
      targetImpedanceMin: 25,
      targetImpedanceMax: 75,
    })
  }
  expect(
    busProps.parse({ connections: ["A"], targetImpedance: "1±0.1kohm" }),
  ).toMatchObject({
    targetImpedance: 1000,
    targetImpedanceMin: 900,
    targetImpedanceMax: 1100,
  })
  expect(
    busProps.parse({ connections: ["A"], targetImpedance: "50ohm±0.025kohm" }),
  ).toMatchObject({
    targetImpedance: 50,
    targetImpedanceMin: 25,
    targetImpedanceMax: 75,
  })
  expect(
    busProps.parse({ connections: ["A"], targetImpedance: "50±0ohm" }),
  ).toMatchObject({
    targetImpedance: 50,
    targetImpedanceMin: 50,
    targetImpedanceMax: 50,
  })
})

test("explicit bounds work without inventing a nominal target", () => {
  expect(
    busProps.parse({
      connections: ["A"],
      targetImpedanceMin: "25ohm",
      targetImpedanceMax: "75ohm",
    }),
  ).toEqual({
    connections: ["A"],
    targetImpedanceMin: 25,
    targetImpedanceMax: 75,
  })
  expect(
    busProps.parse({ connections: ["A"], targetImpedanceMin: 25 }),
  ).toEqual({ connections: ["A"], targetImpedanceMin: 25 })
  expect(
    busProps.parse({
      connections: ["A"],
      targetImpedance: 50,
      targetImpedanceMin: 25,
      targetImpedanceMax: 75,
    }).targetImpedance,
  ).toBe(50)
  expect(
    busProps.parse({
      connections: ["A"],
      targetImpedance: "50±25ohm",
      targetImpedanceMin: 25,
      targetImpedanceMax: 75,
    }),
  ).toMatchObject({
    targetImpedance: 50,
    targetImpedanceMin: 25,
    targetImpedanceMax: 75,
  })
})

test("differential impedance uses the same scalar syntax and flat bounds", () => {
  expect(
    differentialPairProps.parse({
      positiveConnection: "P",
      negativeConnection: "N",
      targetDifferentialImpedance: "100±10ohm",
    }),
  ).toEqual({
    positiveConnection: "P",
    negativeConnection: "N",
    targetDifferentialImpedance: 100,
    targetDifferentialImpedanceMin: 90,
    targetDifferentialImpedanceMax: 110,
  })
  expect(
    differentialPairProps.parse({
      positiveConnection: "P",
      negativeConnection: "N",
      targetDifferentialImpedanceMin: "90ohm",
      targetDifferentialImpedanceMax: "110ohm",
    }),
  ).toMatchObject({
    targetDifferentialImpedanceMin: 90,
    targetDifferentialImpedanceMax: 110,
  })
})

test("reject malformed tolerances, nonpositive bounds, objects and contradictory notations", () => {
  for (const props of [
    { targetImpedance: "50±-25ohm" },
    { targetImpedance: "50±50ohm" },
    { targetImpedance: "50±Infinityohm" },
    { targetImpedance: "50±25±5ohm" },
    { targetImpedance: "50±25%" },
    { targetImpedance: "±25ohm" },
    { targetImpedance: { min: 25, max: 75 } },
    { targetImpedanceMin: 0 },
    { targetImpedanceMax: Infinity },
    { targetImpedanceMin: "25±5ohm" },
    { targetImpedanceMin: 75, targetImpedanceMax: 25 },
    { targetImpedance: 50, targetImpedanceMin: 60 },
    { targetImpedance: 50, targetImpedanceMax: 40 },
    { targetImpedance: "50±25ohm", targetImpedanceMin: 26 },
    { targetImpedance: "50±25ohm", targetImpedanceMax: 74 },
  ])
    expect(busProps.safeParse({ connections: ["A"], ...props }).success).toBe(
      false,
    )
  expect(
    differentialPairProps.safeParse({
      positiveConnection: "P",
      negativeConnection: "N",
      targetDifferentialImpedance: "100±10ohm",
      targetDifferentialImpedanceMin: 95,
    }).success,
  ).toBe(false)
})
