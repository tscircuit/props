import { expect, test } from "bun:test"
import {
  type CanonicalBusFanoutDirection,
  busFanoutDirection,
} from "lib/common/fanoutProps"

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

test("all edge-first fanout directions parse in scalar and object form", () => {
  for (const direction of canonicalDirections) {
    expect(busFanoutDirection.parse(direction)).toBe(direction)
    expect(busFanoutDirection.parse({ direction })).toEqual({ direction })
  }
})
