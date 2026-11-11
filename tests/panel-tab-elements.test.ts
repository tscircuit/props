import { expect, test } from "bun:test"
import { panelProps, panelTabProps, panelTabKeepoutProps } from "lib/index"

test("panel tab elements use edge-named offsets and validate their domains", () => {
  expect(
    panelTabProps.parse({
      boardName: "B1",
      boardEdge: "right",
      centerOffsetFromBoardTopEdge: "6mm",
      tabWidth: "3mm",
    }),
  ).toEqual({
    boardName: "B1",
    boardEdge: "right",
    centerOffsetFromBoardTopEdge: 6,
    tabWidth: 3,
  })
  expect(
    panelTabProps.parse({
      boardEdge: "top",
      centerOffsetFromBoardRightEdge: 4,
    }),
  ).toEqual({ boardEdge: "top", centerOffsetFromBoardRightEdge: 4 })
  expect(
    panelTabKeepoutProps.parse({ boardEdge: "top", from: "2mm", to: "4mm" }),
  ).toEqual({ boardEdge: "top", from: 2, to: 4 })

  for (const offset of [-1, Infinity, "-1mm"])
    expect(
      panelTabProps.safeParse({
        boardEdge: "top",
        centerOffsetFromBoardLeftEdge: offset,
      }).success,
    ).toBe(false)
  for (const tabWidth of [0, -1, Infinity])
    expect(
      panelTabProps.safeParse({
        boardEdge: "top",
        centerOffsetFromBoardLeftEdge: 1,
        tabWidth,
      }).success,
    ).toBe(false)
  expect(
    panelTabProps.safeParse({
      boardEdge: "front",
      centerOffsetFromBoardTopEdge: 1,
    }).success,
  ).toBe(false)

  expect(
    panelTabProps.safeParse({ boardEdge: "left" }).error?.issues[0]?.message,
  ).toBe(
    "A left edge panel tab needs exactly one of centerOffsetFromBoardTopEdge or centerOffsetFromBoardBottomEdge",
  )
  expect(
    panelTabProps.safeParse({
      boardEdge: "left",
      centerOffsetFromBoardTopEdge: 1,
      centerOffsetFromBoardBottomEdge: 1,
    }).success,
  ).toBe(false)
  expect(
    panelTabProps.safeParse({
      boardEdge: "top",
      centerOffsetFromBoardTopEdge: 1,
    }).error?.issues[0]?.message,
  ).toBe(
    "centerOffsetFromBoardTopEdge cannot place a tab on the top edge; use centerOffsetFromBoardLeftEdge or centerOffsetFromBoardRightEdge",
  )

  expect(
    panelTabKeepoutProps.safeParse({ boardEdge: "top", from: 4, to: 2 })
      .success,
  ).toBe(false)
  for (const tabCountPerEdge of [0, -1, 1.5, Infinity])
    expect(panelProps.safeParse({ tabCountPerEdge }).success).toBe(false)
  expect(panelProps.parse({ tabCountPerEdge: 2 }).tabCountPerEdge).toBe(2)
  expect(panelProps.parse({})).not.toHaveProperty("tabCountPerEdge")
})
