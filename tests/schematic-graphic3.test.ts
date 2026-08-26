import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should reject imageUrl and svgContent together", () => {
  const result = schematicGraphicProps.safeParse({
    imageUrl: "https://example.com/system-block-diagram.svg",
    svgContent: '<svg viewBox="0 0 100 50" />',
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe(
      "imageUrl and svgContent cannot both be provided",
    )
  }
})
