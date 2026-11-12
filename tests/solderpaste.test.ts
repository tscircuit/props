import { expect, test } from "bun:test"
import { solderPasteProps } from "lib/components/solderpaste"

test("parses independent oval, rotated rectangle and polygon paste apertures", () => {
  for (const shape of ["rect", "oval"]) {
    expect(
      solderPasteProps.parse({
        shape,
        width: "4mm",
        height: "2mm",
        pcbRotation: "35deg",
      }),
    ).toMatchObject({
      shape,
      width: 4,
      height: 2,
      pcbRotation: 35,
    })
  }
  expect(
    solderPasteProps.safeParse({ shape: "polygon", points: [] }).success,
  ).toBe(false)
})
