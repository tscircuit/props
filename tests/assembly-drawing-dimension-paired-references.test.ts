import { expect, test } from "bun:test"
import { assemblyDrawingDimensionProps } from "../lib"

test("paired dimensions preserve selectors and view anchors and reject incomplete or conflicting targets", () => {
  expect(
    assemblyDrawingDimensionProps.parse({ fromRef: " .H1 ", toRef: " .H2 " }),
  ).toEqual({ fromRef: ".H1", toRef: ".H2" })
  for (const axis of ["x", "y"] as const)
    for (const fromAnchor of [
      "center",
      "left",
      "right",
      "top",
      "bottom",
    ] as const) {
      const input = {
        fromRef: ".board",
        toRef: ".H1",
        axis,
        fromAnchor,
        toAnchor: "center" as const,
      }
      expect(assemblyDrawingDimensionProps.parse(input)).toEqual(input)
    }
  for (const invalid of [
    { fromRef: ".H1" },
    { toRef: ".H2" },
    { fromRef: " ", toRef: ".H2" },
    { fromRef: ".H1", toRef: ".H2", widthOfView: true },
    { fromRef: ".H1", toRef: ".H2", heightOfView: true },
    { fromRef: ".H1", toRef: ".H2", edgeRef: ".rim" },
    { fromRef: ".H1", toRef: ".H2", axis: "z" },
    { fromRef: ".H1", toRef: ".H2", fromAnchor: "front" },
    { widthOfView: true, fromAnchor: "left" },
    { edgeRef: ".rim", axis: "x" },
    { heightOfView: true, toAnchor: "center" },
  ])
    expect(assemblyDrawingDimensionProps.safeParse(invalid).success).toBe(false)
})
