import { expect, test } from "bun:test"
import {
  type CanonicalBusFanoutDirection,
  busFanoutDirection,
} from "lib/common/fanoutProps"
import type { NinePointAnchor } from "lib/common/ninePointAnchor"

const canonicalDirections: CanonicalBusFanoutDirection[] = [
  "topside_left",
  "topside_center",
  "topside_right",
  "rightside_top",
  "rightside_center",
  "rightside_bottom",
  "bottomside_right",
  "bottomside_center",
  "bottomside_left",
  "leftside_bottom",
  "leftside_center",
  "leftside_top",
  "center",
]

const legacyNinePointDirections: NinePointAnchor[] = [
  "top_left",
  "top_center",
  "top_right",
  "center_left",
  "center",
  "center_right",
  "bottom_left",
  "bottom_center",
  "bottom_right",
]

test("canonical and legacy fanout directions parse in both forms", () => {
  for (const direction of canonicalDirections) {
    expect(busFanoutDirection.parse(direction)).toBe(direction)
    expect(busFanoutDirection.parse({ direction })).toEqual({ direction })
  }

  for (const direction of legacyNinePointDirections) {
    expect(busFanoutDirection.parse(direction)).toBe(direction)
    expect(busFanoutDirection.parse({ direction })).toEqual({ direction })
  }
})
