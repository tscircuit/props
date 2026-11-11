import { expect, test } from "bun:test"
import { differentialPairProps } from "lib/components/differentialpair"

const base = {
  positiveConnection: "DP",
  negativeConnection: "DM",
  maxLengthSkew: 0,
}

test("a connection is one string or a list of trace names in signal order", () => {
  expect(
    differentialPairProps.parse({ ...base, positiveConnection: "net.USB_DP" })
      .positiveConnection,
  ).toBe("net.USB_DP")
  expect(
    differentialPairProps.parse({ ...base, positiveConnection: ["DP1", "DP2"] })
      .positiveConnection,
  ).toEqual(["DP1", "DP2"])
  for (const bad of ["", [], [""]])
    expect(
      differentialPairProps.safeParse({ ...base, positiveConnection: bad })
        .success,
    ).toBe(false)
})

test("maxLengthSkew is required and parsed to mm", () => {
  expect(
    differentialPairProps.parse({ ...base, maxLengthSkew: "2mil" })
      .maxLengthSkew,
  ).toBe(0.0508)
  expect(
    differentialPairProps.safeParse({ ...base, maxLengthSkew: undefined })
      .success,
  ).toBe(false)
})

test.each([
  { pcbTraceGap: 0.1 },
  { targetDifferentialImpedance: 90 },
  { targetLength: 5 },
  { lengthMatchTo: "X" },
])("rejects unsupported prop %j", (props) => {
  expect(() => differentialPairProps.parse({ ...base, ...props })).toThrow(
    "differentialpair only supports maxLengthSkew for now",
  )
})
