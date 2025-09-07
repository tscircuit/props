import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

// ensure footprintLibraryMap functions can return cadModel in addition to footprintCircuitJson

test("footprintLibraryMap function may return cadModel", async () => {
  const config = platformConfig.parse({
    footprintLibraryMap: {
      lib: async (_path: string) => ({
        footprintCircuitJson: [],
        cadModel: { stlUrl: "model.stl" },
      }),
    },
  })
  const result = await config.footprintLibraryMap!.lib("myfootprint")
  expect(result.cadModel).toEqual({ stlUrl: "model.stl" })
  expect(Array.isArray(result.footprintCircuitJson)).toBe(true)
})
