import { expect, test } from "bun:test"
import { assemblyDrawingDimensionProps } from "../lib"

test("dimension inputs require a named edge and finite paper placement with bounded precision", () => {
  for (const invalid of [
    {},
    { edgeRef: "" },
    { edgeRef: "  " },
    { edgeRef: 2 },
    { edgeRef: "overall_width", orientation: "diagonal" },
    { edgeRef: "overall_width", offset: Infinity },
    { edgeRef: "overall_width", offset: NaN },
    { edgeRef: "overall_width", precision: -1 },
    { edgeRef: "overall_width", precision: 7 },
    { edgeRef: "overall_width", precision: 1.5 },
  ])
    expect(assemblyDrawingDimensionProps.safeParse(invalid).success).toBe(false)
  for (const offset of [-10, 0, 10])
    expect(
      assemblyDrawingDimensionProps.parse({
        edgeRef: "wall_thickness",
        orientation: "vertical",
        offset,
        precision: 0,
      }).offset,
    ).toBe(offset)
  const dimension = assemblyDrawingDimensionProps.parse({
    edgeRef: "overall_width",
    value: 100,
    edgeIndex: 4,
  })
  expect(dimension).toEqual({
    edgeRef: "overall_width",
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
})
