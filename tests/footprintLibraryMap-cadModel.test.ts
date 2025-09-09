import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

// ensure footprintLibraryMap functions can return cadModel in addition to footprintCircuitJson

test("footprintLibraryMap function may return cadModel", async () => {
  const config = platformConfig.parse({
    footprintLibraryMap: {
      lib: async (_path: string) => ({
        footprintCircuitJson: [],
        cadModel: {
          objUrl: "model.obj",
          mtlUrl: "model.mtl",
          rotationOffset: { x: 1, y: 2, z: 3 },
          positionOffset: { x: 4, y: 5, z: 6 },
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
  expect(result.cadModel).toEqual({
    objUrl: "model.obj",
    mtlUrl: "model.mtl",
    rotationOffset: { x: 1, y: 2, z: 3 },
    positionOffset: { x: 4, y: 5, z: 6 },
    size: { x: 7, y: 8, z: 9 },
  })
  expect(Array.isArray(result.footprintCircuitJson)).toBe(true)
})
