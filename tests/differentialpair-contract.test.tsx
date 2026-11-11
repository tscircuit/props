import { expect, test } from "bun:test"
import { createElement } from "react"
import { differentialPairProps } from "lib"

// Untyped spreads model JavaScript authors; validate the actual TSX props.
const Pair = (props: Record<string, unknown>) =>
  createElement("differentialpair", props)

const connections = {
  positiveConnection: "DP",
  negativeConnection: "DM",
}

test.failing("TSX accepts ordered nonempty trace-name lanes", () => {
  const pair = (
    <Pair
      positiveConnection={["DP1", "DP2", "DP3"]}
      negativeConnection={["DM1", "DM2"]}
      maxLengthSkew="0.1mm"
    />
  )
  expect(differentialPairProps.parse(pair.props)).toEqual({
    ...pair.props,
    maxLengthSkew: 0.1,
  })
})

test.failing("TSX requires an explicit maximum length skew", () => {
  const pair = <Pair {...connections} />
  expect(differentialPairProps.safeParse(pair.props).success).toBe(false)
})

test.failing.each([
  { pcbTraceGap: "0.1mm" },
  { maxUncoupledLength: "1mm" },
  { targetDifferentialImpedance: "90ohm" },
  { targetDifferentialImpedanceMin: 80 },
  { targetDifferentialImpedanceMax: 100 },
  { pcbSpacingToOtherSignals: "4w" },
  { minLength: 1 },
  { maxLength: 10 },
  { targetLength: 5, lengthTolerance: 0.1 },
  { lengthTolerance: 0.1 },
  { lengthMatchTo: "OTHER" },
  { unexpectedProp: true },
])("TSX rejects unsupported pair props with a clear error: %j", (props) => {
  const pair = <Pair {...connections} maxLengthSkew={0} {...props} />
  expect(() => differentialPairProps.parse(pair.props)).toThrow(
    "differentialpair only supports maxLengthSkew for now",
  )
})
