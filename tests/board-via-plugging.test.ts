import { expect, test } from "bun:test"
import { type BoardProps, boardProps } from "lib/components/board"

test("board via plugging is optional and independent of tenting", () => {
  const props: BoardProps = {
    plugVias: true,
    defaultViaTenting: false,
  }

  expect(boardProps.parse({})).not.toHaveProperty("plugVias")
  expect(boardProps.parse(props)).toMatchObject({
    plugVias: true,
    defaultViaTenting: "exposed",
  })
  expect(
    boardProps.parse({ plugVias: false, defaultViaTenting: true }),
  ).toMatchObject({
    plugVias: false,
    defaultViaTenting: "top_and_bottom_tented",
  })
  expect(boardProps.safeParse({ plugVias: "true" }).success).toBe(false)
})
