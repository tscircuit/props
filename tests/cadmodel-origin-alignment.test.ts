import { expect, test } from "bun:test"
import { cadModelOriginAlignments } from "../lib/common/cadModel"
import { cadmodelProps } from "../lib/components/cadmodel"

test("cadmodel accepts model origin alignments", () => {
  for (const modelOriginAlignment of cadModelOriginAlignments) {
    const parsed = cadmodelProps.parse({
      modelUrl: "https://example.com/model.glb",
      modelOriginAlignment,
    })

    expect(parsed).toMatchObject({ modelOriginAlignment })
  }
})
