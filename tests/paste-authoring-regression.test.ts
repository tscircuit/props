import { expect, test } from "bun:test"
import { solderPasteProps } from "lib/components/solderpaste"
import { smtPadProps } from "lib/components/smtpad"

test.failing(
  "rectangular paste retains the existing pcbRotation placement prop",
  () => {
    expect(
      solderPasteProps.parse({
        shape: "rect",
        width: 4,
        height: 1,
        pcbRotation: "35deg",
      }),
    ).toMatchObject({ pcbRotation: 35 })
  },
)

test.failing("rectangular pads retain separate local-axis paste ratios", () => {
  expect(
    smtPadProps.parse({
      shape: "rect",
      width: 4,
      height: 2,
      solderPasteMarginRatio: { x: -0.1, y: -0.25 },
    }),
  ).toMatchObject({ solderPasteMarginRatio: { x: -0.1, y: -0.25 } })
})

test.failing(
  "paste ratios reject missing axes and non-finite fractions",
  () => {
    const pad = { shape: "rect", width: 4, height: 2 }
    expect(
      smtPadProps.safeParse({ ...pad, solderPasteMarginRatio: { x: -0.1 } })
        .success,
    ).toBe(false)
    expect(
      smtPadProps.safeParse({
        ...pad,
        solderPasteMarginRatio: { x: Infinity, y: 0 },
      }).success,
    ).toBe(false)
  },
)
