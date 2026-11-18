import { expect, test } from "bun:test"
import { solderPasteProps } from "lib/components/solderpaste"

test("rectangular paste retains the existing pcbRotation placement prop", () => {
  expect(
    solderPasteProps.parse({
      shape: "rect",
      width: 4,
      height: 1,
      pcbRotation: "35deg",
    }),
  ).toMatchObject({ pcbRotation: 35 })
})
