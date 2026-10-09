import { expect, test } from "bun:test"
import {
  pcbNoiseChannelProps,
  pcbNoiseEyeProps,
  pcbNoiseSimulationProps,
  simulationProps,
} from "lib/index"

test("three strict noise hosts replace the unreleased verbose API", () => {
  expect(simulationProps.pcbnoisesimulation).toBe(pcbNoiseSimulationProps)
  expect(simulationProps.pcbnoisechannel).toBe(pcbNoiseChannelProps)
  expect(simulationProps.pcbnoiseeye).toBe(pcbNoiseEyeProps)
  for (const host of [
    "pcbnoiseport",
    "pcbnoiseexcitation",
    "pcbnoisetermination",
    "pcbnoiseobservation",
  ])
    expect(simulationProps).not.toHaveProperty(host)
  // @ts-expect-error The unreleased verbose host was removed from the public type.
  simulationProps.pcbnoiseport
})
