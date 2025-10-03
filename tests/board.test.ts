import { expect, test } from "bun:test"
import { boardProps, type BoardProps } from "lib/components/board"

// ensure square and area props parse correctly

test("should parse square and area props", () => {
  const raw: BoardProps = {
    name: "brd",
    square: true,
    emptyArea: "20%",
    filledArea: "30%",
  }
  const parsed = boardProps.parse(raw)
  expect(parsed.square).toBe(true)
  expect(parsed.emptyArea).toBe("20%")
  expect(parsed.filledArea).toBe("30%")
})

test("should parse layers prop", () => {
  const raw: BoardProps = { name: "board", layers: 4 }
  const parsed = boardProps.parse(raw)
  expect(parsed.layers).toBe(4)
})

test("should parse borderRadius prop", () => {
  const raw: BoardProps = { name: "board", borderRadius: 2 }
  const parsed = boardProps.parse(raw)
  expect(parsed.borderRadius).toBe(2)
})

test("should parse boardAnchorPosition prop", () => {
  const raw: BoardProps = {
    name: "board",
    boardAnchorPosition: { x: 1, y: 2 },
  }
  const parsed = boardProps.parse(raw)
  expect(parsed.boardAnchorPosition).toEqual({ x: 1, y: 2 })
})

test("should parse boardAnchorAlignment prop", () => {
  const raw: BoardProps = {
    name: "board",
    boardAnchorAlignment: "bottom_right",
  }
  const parsed = boardProps.parse(raw)
  expect(parsed.boardAnchorAlignment).toBe("bottom_right")
})

test("should parse board color customization props", () => {
  const raw: BoardProps = {
    name: "board",
    solderMaskColor: "green",
    topSolderMaskColor: "matte_black",
    bottomSolderMaskColor: "kicad:custom_solder_mask",
    silkscreenColor: "white",
    topSilkscreenColor: "kicad:silkscreen_special",
    bottomSilkscreenColor: "ghost_white",
  }
  const parsed = boardProps.parse(raw)
  expect(parsed.solderMaskColor).toBe("green")
  expect(parsed.topSolderMaskColor).toBe("matte_black")
  expect(parsed.bottomSolderMaskColor).toBe("kicad:custom_solder_mask")
  expect(parsed.silkscreenColor).toBe("white")
  expect(parsed.topSilkscreenColor).toBe("kicad:silkscreen_special")
  expect(parsed.bottomSilkscreenColor).toBe("ghost_white")
})
