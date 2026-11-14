import { expect, test } from "bun:test"
import { boardProps, type BoardProps } from "lib/components/board"

test("defaultSolderPasteMargin parses mm distances and percentages and stays unset when omitted", () => {
  const raw: BoardProps[] = [
    { defaultSolderPasteMargin: 0 },
    { defaultSolderPasteMargin: "-0.05mm" },
    { defaultSolderPasteMargin: "2mil" },
    { defaultSolderPasteMargin: "-10%" },
    { defaultSolderPasteMargin: "12.5%" },
    {},
  ]
  expect(
    raw.map((props) => boardProps.parse(props).defaultSolderPasteMargin),
  ).toMatchInlineSnapshot(`
    [
      0,
      -0.05,
      0.0508,
      "-10%",
      "12.5%",
      undefined,
    ]
  `)
})
