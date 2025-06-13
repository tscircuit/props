import { expect, test } from "bun:test"
import { baseGroupProps, type BaseGroupProps } from "../lib/components/group"

test("should parse cellBorder", () => {
  const raw: BaseGroupProps = {
    name: "g",
    cellBorder: {
      strokeWidth: "2mm",
      dashed: true,
    },
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.cellBorder?.strokeWidth).toBe(2)
  expect(parsed.cellBorder?.dashed).toBe(true)
})
