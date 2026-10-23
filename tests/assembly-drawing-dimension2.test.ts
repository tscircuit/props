import { expect, test } from "bun:test"
import { assemblyDrawingDimensionProps } from "../lib"

test("dimension props require exactly one real selector or true view target", () => {
  for (const invalid of [
    {},
    { edgeRef: "" },
    { edgeRef: "  " },
    { edgeRef: 2 },
    { name: 2, edgeRef: ".tube > .inner_top" },
    { widthOfView: false },
    { heightOfView: false },
    { widthOfView: false, heightOfView: false },
    { widthOfView: true, heightOfView: true },
    { widthOfView: true, edgeRef: ".tube > .inner_top" },
    { heightOfView: true, edgeRef: ".tube > .inner_top" },
    { widthOfView: "true" },
    { heightOfView: "true" },
    { orientation: "aligned", offset: 8, precision: 1 },
  ])
    expect(assemblyDrawingDimensionProps.safeParse(invalid).success).toBe(false)
  expect(
    assemblyDrawingDimensionProps.parse({
      edgeRef: ".tube > .inner_top",
      widthOfView: false,
      heightOfView: false,
      value: 100,
      edgeIndex: 4,
    }),
  ).toEqual({
    edgeRef: ".tube > .inner_top",
    widthOfView: false,
    heightOfView: false,
  })
  for (const target of [
    { widthOfView: true, heightOfView: false },
    { widthOfView: false, heightOfView: true },
  ])
    expect(assemblyDrawingDimensionProps.parse(target)).toEqual(target)
})
