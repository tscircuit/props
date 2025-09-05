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
