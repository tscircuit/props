import { expect, test } from "bun:test"
import { type BoardProps, boardProps, stampboardProps } from "lib"

test("boards preserve each manufacturing via covering choice", () => {
  for (const viaCovering of [
    "untented",
    "tented",
    "plugged",
    "epoxy_filled_and_capped",
    "copper_paste_filled_and_capped",
  ] as const) {
    const props: BoardProps = { viaCovering }
    const parsed = boardProps.parse(props)
    expect(parsed.viaCovering).toBe(viaCovering)
    expect(parsed).not.toHaveProperty("defaultViaTenting")
    expect(stampboardProps.parse(props).viaCovering).toBe(viaCovering)
  }
})

test("viaCovering stays optional and preserves explicit tenting", () => {
  expect(boardProps.parse({})).not.toHaveProperty("viaCovering")
  expect(
    boardProps.parse({
      viaCovering: "epoxy_filled_and_capped",
      defaultViaTenting: "top_tented",
    }),
  ).toMatchObject({
    viaCovering: "epoxy_filled_and_capped",
    defaultViaTenting: "top_tented",
  })
  for (const viaCovering of [true, false, "epoxy", null]) {
    expect(boardProps.safeParse({ viaCovering }).success).toBe(false)
  }
})
