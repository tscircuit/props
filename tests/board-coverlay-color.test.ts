import { expect, test } from "bun:test"
import { boardProps, type BoardProps } from "lib/components/board"

test("yellow coverlay is accepted for a flex board", () => {
  const props: BoardProps = { material: "flex", coverlayColor: "yellow" }
  expect(boardProps.parse(props).coverlayColor).toBe("yellow")
})

test("black coverlay is independent from solder mask color", () => {
  const props: BoardProps = {
    material: "flex",
    coverlayColor: "black",
    solderMaskColor: "green",
  }
  const parsed = boardProps.parse(props)
  expect(parsed.coverlayColor).toBe("black")
  expect(parsed.solderMaskColor).toBe("green")
})

test("white coverlay is accepted for a flex board", () => {
  const props: BoardProps = { material: "flex", coverlayColor: "white" }
  expect(boardProps.parse(props).coverlayColor).toBe("white")
})

test("coverlay color has no default", () => {
  expect(boardProps.parse({ material: "flex" }).coverlayColor).toBeUndefined()
  expect(boardProps.parse({}).coverlayColor).toBeUndefined()
})

test("green is not a coverlay color", () => {
  expect(
    boardProps.safeParse({ material: "flex", coverlayColor: "green" }).success,
  ).toBe(false)
})

test("custom hex coverlay colors are rejected", () => {
  expect(
    boardProps.safeParse({ material: "flex", coverlayColor: "#ffffff" })
      .success,
  ).toBe(false)
})
