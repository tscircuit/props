import { expect, test } from "bun:test"
import { analogSimulationProps } from "lib/components/analogsimulation"

test("TI iteration limits survive analog simulation prop parsing", () => {
  const parsed = analogSimulationProps.parse({
    spiceOptions: {
      method: "trap",
      abstol: "10n",
      vntol: "10u",
      itl1: 1500,
      itl2: 400,
      itl4: 400,
    },
  })

  expect({
    spiceOptions: parsed.spiceOptions,
    invalidCountsAccepted: ["itl1", "itl2", "itl4"].map((name) => ({
      name,
      accepted: [0, -1, 1.5, "400"].map(
        (count) =>
          analogSimulationProps.safeParse({
            spiceOptions: { [name]: count },
          }).success,
      ),
    })),
  }).toMatchSnapshot()
})
