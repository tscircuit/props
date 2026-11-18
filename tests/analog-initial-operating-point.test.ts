import { expect, test } from "bun:test"
import { analogSimulationProps } from "lib/components/analogsimulation"
import { analogTransientSimulationProps } from "lib/components/analogtransientsimulation"

test("both transient APIs serialize an initial operating-point request", () => {
  expect({
    analogSimulation: analogSimulationProps.parse({
      calculateInitialOperatingPoint: true,
    }),
    analogTransientSimulation: analogTransientSimulationProps.parse({
      calculateInitialOperatingPoint: true,
    }),
  }).toMatchInlineSnapshot(`
    {
      "analogSimulation": {
        "calculateInitialOperatingPoint": true,
        "simulationType": "spice_transient_analysis",
      },
      "analogTransientSimulation": {
        "calculateInitialOperatingPoint": true,
        "duration": 10,
        "startTime": 0,
        "timePerStep": 0.01,
      },
    }
  `)
})
