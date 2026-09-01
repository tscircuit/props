import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should require at least one graphic source", () => {
  const result = schematicGraphicProps.safeParse({})

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe(
      "At least one of imageUrl or svgContent is required",
    )
  }
})
