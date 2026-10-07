import { expect, test } from "bun:test"
import { assemblyPartProps, assemblyPrintedPartProps } from "lib/assembly"
import { explodeDirectionNames, explodeProps } from "lib/common/exploded-view"
import { chipProps } from "lib/components/chip"
import { groupProps } from "lib/components/group"

test("components parse flat exploded-view props", () => {
  const explodedView = {
    explodeDirection: { x: 1, y: -0.35, z: 0 },
    explodeDistance: "4.8cm",
  } as const

  expect(
    chipProps.parse({ name: "USB_POWER_CABLE", ...explodedView }),
  ).toMatchObject({
    explodeDirection: { x: 1, y: -0.35, z: 0 },
    explodeDistance: 48,
  })
  expect(
    groupProps.parse({
      name: "DISPLAY_ASSEMBLY",
      explodeDirection: "above",
      explodeDistance: "60mm",
    }),
  ).toMatchObject({
    explodeDirection: "above",
    explodeDistance: 60,
  })
  expect(
    assemblyPartProps.parse({
      name: "FASTENER_GROUP",
      explodeDirection: "above",
      explodeDistance: "22mm",
    }),
  ).toMatchObject({
    explodeDirection: "above",
    explodeDistance: 22,
  })
  expect(
    assemblyPrintedPartProps.parse({
      name: "ENCLOSURE_BASE",
      model: "museair_enclosure_base",
      explodeDirection: "below",
      explodeDistance: 60,
    }),
  ).toMatchObject({
    explodeDirection: "below",
    explodeDistance: 60,
  })

  expect(
    explodeProps.safeParse({
      explodeDirection: { x: 0, y: 0, z: 0 },
      explodeDistance: 20,
    }).success,
  ).toBe(false)
  expect(
    explodeProps.safeParse({
      explodeDirection: "above",
      explodeDistance: 0,
    }).success,
  ).toBe(false)
})

test("explode directions use the canonical board-space names", () => {
  expect(explodeDirectionNames).toEqual([
    "right",
    "left",
    "top",
    "bottom",
    "above",
    "below",
  ])

  for (const ambiguousDirection of [
    "up",
    "down",
    "front",
    "back",
    "from_above",
    "x_pos",
    "x+",
    "z_neg",
    "z-",
  ]) {
    expect(
      explodeProps.safeParse({
        explodeDirection: ambiguousDirection,
        explodeDistance: 20,
      }).success,
    ).toBe(false)
  }
})
