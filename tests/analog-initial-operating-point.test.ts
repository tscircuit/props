import { expect, test } from "bun:test"
import { analogSimulationProps } from "lib/components/analogsimulation"
import { analogTransientSimulationProps } from "lib/components/analogtransientsimulation"

test("both transient APIs preserve an explicit initial operating-point request", () => {
  expect(
    analogSimulationProps.parse({ calculateInitialOperatingPoint: true }),
  ).toHaveProperty("calculateInitialOperatingPoint", true)
  expect(
    analogTransientSimulationProps.parse({
      calculateInitialOperatingPoint: true,
    }),
  ).toHaveProperty("calculateInitialOperatingPoint", true)
})
