import { expect, test } from "bun:test"
import { type BoardProps, boardProps, stampboardProps } from "lib"

test("boards preserve each manufacturing via plugging choice", () => {
  for (const viaPlugging of [
    "solder_mask_ink",
    "epoxy_filled_and_capped",
    "copper_paste_filled_and_capped",
  ] as const) {
    const props: BoardProps = { viaPlugging }
    const parsed = boardProps.parse(props)
    expect(parsed.viaPlugging).toBe(viaPlugging)
    expect(parsed).not.toHaveProperty("defaultViaTenting")
    expect(stampboardProps.parse(props).viaPlugging).toBe(viaPlugging)
  }
})

test("viaPlugging stays optional and preserves explicit tenting", () => {
  expect(boardProps.parse({})).not.toHaveProperty("viaPlugging")
  expect(
    boardProps.parse({
      viaPlugging: "epoxy_filled_and_capped",
      defaultViaTenting: "top_tented",
    }),
  ).toMatchObject({
    viaPlugging: "epoxy_filled_and_capped",
    defaultViaTenting: "top_tented",
  })
  for (const viaPlugging of [
    true,
    false,
    "tented",
    "untented",
    "epoxy",
    null,
  ]) {
    expect(boardProps.safeParse({ viaPlugging }).success).toBe(false)
  }
})
