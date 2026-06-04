import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  silkscreenGraphicProps,
  type SilkscreenGraphicProps,
} from "lib/components/silkscreen-graphic"

test("should parse a silkscreen graphic from an image", () => {
  const raw: SilkscreenGraphicProps = {
    imageUrl: "https://example.com/logo.png",
    width: "5mm",
    height: 2,
    pcbX: 1,
    pcbY: -1,
    layer: "top",
  }

  expectTypeOf(raw).toMatchTypeOf<SilkscreenGraphicProps>()
  const parsed = silkscreenGraphicProps.parse(raw)

  expect(parsed.imageUrl).toBe("https://example.com/logo.png")
  expect(parsed.width).toBe(5)
  expect(parsed.height).toBe(2)
  expect(parsed.pcbX).toBe(1)
  expect(parsed.pcbY).toBe(-1)
  expect(parsed.layer).toBe("top")
  expect("brep" in parsed).toBe(false)
  expect("brepShape" in parsed).toBe(false)
})

test("should parse a static-file import shaped imageUrl", () => {
  const parsed = silkscreenGraphicProps.parse({
    imageUrl: { default: "/assets/logo.svg" },
    width: 3,
    height: "4mm",
    layer: "bottom",
  })

  expect(parsed.imageUrl).toBe("/assets/logo.svg")
  expect(parsed.width).toBe(3)
  expect(parsed.height).toBe(4)
  expect(parsed.layer).toBe("bottom")
})
