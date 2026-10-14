import { expect, test } from "bun:test"
import { cadmodelProps } from "../lib/components/cadmodel"

test("cadmodel rejects JSCAD combined with another model source", () => {
  const mixedModelSources = {
    modelUrl: "/part.glb",
    jscad: { type: "cuboid", size: [2, 3, 4] },
  }

  expect(cadmodelProps.safeParse(mixedModelSources).success).toBe(false)
})
