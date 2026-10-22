import { expect, test } from "bun:test"
import { assemblyDrawingDimensionProps } from "../lib"

test("dimension targets are exclusive and placement and precision remain bounded", () => {
  for (const invalid of [
    {},
    { edgeRef: "" },
    { edgeRef: "  " },
    { edgeRef: 2 },
    { widthOfView: false },
    { heightOfView: false },
    { widthOfView: false, heightOfView: false },
    { widthOfView: true, heightOfView: true },
    { widthOfView: true, edgeRef: ".tube > .outer_top" },
    { heightOfView: true, edgeRef: ".tube > .outer_top" },
    { widthOfView: true, orientation: "horizontal" },
    { heightOfView: true, orientation: "vertical" },
    { widthOfView: true, orientation: "aligned" },
    { heightOfView: true, orientation: "aligned" },
    { widthOfView: "true" },
    { edgeRef: ".tube > .outer_top", orientation: "diagonal" },
    { edgeRef: ".tube > .outer_top", offset: Infinity },
    { edgeRef: ".tube > .outer_top", offset: NaN },
    { edgeRef: ".tube > .outer_top", precision: -1 },
    { edgeRef: ".tube > .outer_top", precision: 7 },
    { edgeRef: ".tube > .outer_top", precision: 1.5 },
  ])
    expect(assemblyDrawingDimensionProps.safeParse(invalid).success).toBe(false)
  for (const offset of [-10, 0, 10])
    expect(
      assemblyDrawingDimensionProps.parse({
        edgeRef: ".tube > .wall_top_left",
        orientation: "vertical",
        offset,
        precision: 0,
      }).offset,
    ).toBe(offset)
  const dimension = assemblyDrawingDimensionProps.parse({
    edgeRef: ".tube > .outer_top",
    widthOfView: false,
    heightOfView: false,
    value: 100,
    edgeIndex: 4,
  })
  expect(dimension).toEqual({
    edgeRef: ".tube > .outer_top",
    widthOfView: false,
    heightOfView: false,
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
  expect(
    assemblyDrawingDimensionProps.parse({
      widthOfView: true,
      heightOfView: false,
    }).orientation,
  ).toBe("horizontal")
  expect(
    assemblyDrawingDimensionProps.parse({
      widthOfView: false,
      heightOfView: true,
    }).orientation,
  ).toBe("vertical")
})
