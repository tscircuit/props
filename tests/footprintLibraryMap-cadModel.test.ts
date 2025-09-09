import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

// ensure footprintLibraryMap functions can return cadModel in addition to footprintCircuitJson

test("footprintLibraryMap function may return cadComponent", async () => {
  const config = platformConfig.parse({
    footprintLibraryMap: {
      lib: async (_path: string) => ({
        footprintCircuitJson: [],
        cadComponent: {
          type: "cad_component",
          cad_component_id: "test_cad_1",
          position: { x: 4, y: 5, z: 6 },
          size: { x: 7, y: 8, z: 9 },
        },
      }),
    },
  })
  const entry = config.footprintLibraryMap?.lib
  if (typeof entry !== "function") {
    throw new Error("footprintLibraryMap.lib is not a function")
  }
  const result = await entry("myfootprint")
  expect(result.cadComponent).toEqual({
    type: "cad_component",
    cad_component_id: "test_cad_1",
    position: { x: 4, y: 5, z: 6 },
    size: { x: 7, y: 8, z: 9 },
  })
  expect(Array.isArray(result.footprintCircuitJson)).toBe(true)
})
