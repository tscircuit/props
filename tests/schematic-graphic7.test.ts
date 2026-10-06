import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should reject an empty graphic source", () => {
  const result = schematicGraphicProps.safeParse({ svgContent: "   " })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.message).toBe("svgContent cannot be empty")
  }
})
