import { expect, test } from "bun:test"
import { type BoardProps, boardProps } from "lib/components/board"

test("board via plugging is optional and independent of tenting", () => {
  const props: BoardProps = {
    defaultViaPlugging: true,
    defaultViaTenting: false,
  }

  expect(boardProps.parse({})).not.toHaveProperty("defaultViaPlugging")
  expect(boardProps.parse(props)).toMatchObject({
    defaultViaPlugging: true,
    defaultViaTenting: "exposed",
  })
  expect(
    boardProps.parse({ defaultViaPlugging: false, defaultViaTenting: true }),
  ).toMatchObject({
    defaultViaPlugging: false,
    defaultViaTenting: "top_and_bottom_tented",
  })
  expect(boardProps.safeParse({ defaultViaPlugging: "true" }).success).toBe(
    false,
  )
})
