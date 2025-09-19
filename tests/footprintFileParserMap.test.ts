import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("footprintFileParserMap loadFromUrl returns footprint data", async () => {
  const config = platformConfig.parse({
    footprintFileParserMap: {
      kicad_mod: {
        loadFromUrl: async (url: string) => {
          expect(url).toBe("https://example.com/resistor.kicad_mod")
          return {
            footprintCircuitJson: [],
            cadModel: {
              objUrl: "model.obj",
              mtlUrl: "model.mtl",
              rotationOffset: { x: 1, y: 2, z: 3 },
              positionOffset: { x: 4, y: 5, z: 6 },
              size: { x: 7, y: 8, z: 9 },
              modelUnitToMmScale: 2,
            },
          }
        },
      },
    },
  })

  const loader = config.footprintFileParserMap?.kicad_mod?.loadFromUrl
  if (typeof loader !== "function") {
    throw new Error(
      "footprintFileParserMap.kicad_mod.loadFromUrl is not a function",
    )
  }

  const result = await loader("https://example.com/resistor.kicad_mod")
  expect(result.cadModel).toEqual({
    objUrl: "model.obj",
    mtlUrl: "model.mtl",
    rotationOffset: { x: 1, y: 2, z: 3 },
    positionOffset: { x: 4, y: 5, z: 6 },
    size: { x: 7, y: 8, z: 9 },
    modelUnitToMmScale: 2,
  })
  expect(Array.isArray(result.footprintCircuitJson)).toBe(true)
})
