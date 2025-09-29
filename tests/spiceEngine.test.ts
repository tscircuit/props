import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("spiceEngine simulate returns simulation result", async () => {
  const config = platformConfig.parse({
    spiceEngine: {
      async simulate(spiceString: string) {
        expect(spiceString).toBe("R1 1 0 1k")

        return {
          engineVersionString: "1.0.0",
          simulationResultCircuitJson: [],
        }
      },
    },
  })

  const result = await config.spiceEngine?.simulate("R1 1 0 1k")
  expect(result?.engineVersionString).toBe("1.0.0")
  expect(Array.isArray(result?.simulationResultCircuitJson)).toBe(true)
})
