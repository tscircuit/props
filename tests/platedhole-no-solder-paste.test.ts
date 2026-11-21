import { expect, test } from "bun:test"
import {
  platedHoleProps,
  type PlatedHoleProps,
} from "../lib/components/platedhole"

const holes: PlatedHoleProps[] = [
  { shape: "circle", holeDiameter: 1, outerDiameter: 2 },
  {
    shape: "pill",
    holeWidth: 0.6,
    holeHeight: 1.2,
    outerWidth: 1.2,
    outerHeight: 1.8,
  },
  {
    shape: "oval",
    holeWidth: 1,
    holeHeight: 2,
    outerWidth: 2,
    outerHeight: 3,
  },
  {
    shape: "circular_hole_with_rect_pad",
    holeDiameter: 1,
    rectPadWidth: 2,
    rectPadHeight: 3,
  },
  {
    shape: "pill_hole_with_rect_pad",
    holeWidth: 1,
    holeHeight: 2,
    rectPadWidth: 2,
    rectPadHeight: 3,
  },
  {
    shape: "hole_with_polygon_pad",
    holeShape: "circle",
    holeDiameter: 1,
    padOutline: [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ],
    holeOffsetX: 0,
    holeOffsetY: 0,
  },
]

for (const hole of holes) {
  test(`${hole.shape} accepts noSolderPaste without changing hole geometry`, () => {
    for (const noSolderPaste of [true, false, undefined]) {
      const props: PlatedHoleProps = { ...hole, noSolderPaste }
      const { noSolderPaste: parsed, ...geometry } =
        platedHoleProps.parse(props)
      expect(parsed).toBe(noSolderPaste)
      expect(geometry).toEqual(platedHoleProps.parse(hole))
    }
    expect(
      platedHoleProps.safeParse({ ...hole, noSolderPaste: "true" }).success,
    ).toBe(false)
  })
}
