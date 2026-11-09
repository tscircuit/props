import { expect, test } from "bun:test"
import { panelProps, panelTabProps, panelTabKeepoutProps } from "lib/index"

test("panel tab elements normalize edge offsets and validate their domains", () => {
  expect(
    panelTabProps.parse({ boardName: "B1", boardEdge: "right", offset: "6mm" }),
  ).toEqual({ boardName: "B1", boardEdge: "right", offset: 6 })
  expect(
    panelTabKeepoutProps.parse({ boardEdge: "top", from: "2mm", to: "4mm" }),
  ).toEqual({ boardEdge: "top", from: 2, to: 4 })
  for (const offset of [-1, Infinity, "-1mm"])
    expect(panelTabProps.safeParse({ boardEdge: "top", offset }).success).toBe(
      false,
    )
  expect(
    panelTabProps.safeParse({ boardEdge: "front", offset: 1 }).success,
  ).toBe(false)
  expect(
    panelTabKeepoutProps.safeParse({ boardEdge: "top", from: 4, to: 2 })
      .success,
  ).toBe(false)
  for (const tabCountPerEdge of [0, -1, 1.5, Infinity])
    expect(panelProps.safeParse({ tabCountPerEdge }).success).toBe(false)
  expect(panelProps.parse({ tabCountPerEdge: 2 }).tabCountPerEdge).toBe(2)
  expect(panelProps.parse({})).not.toHaveProperty("tabCountPerEdge")
})
