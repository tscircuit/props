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

test("should parse border", () => {
  const raw: BaseGroupProps = {
    name: "g",
    border: {
      strokeWidth: "1mm",
      solid: true,
    },
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.border?.strokeWidth).toBe(1)
  expect(parsed.border?.solid).toBe(true)
})

test("should allow null for cellBorder", () => {
  const raw: BaseGroupProps = {
    name: "g",
    cellBorder: null,
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.cellBorder).toBeNull()
})

test("should allow null for border", () => {
  const raw: BaseGroupProps = {
    name: "g",
    border: null,
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.border).toBeNull()
})

test("should parse schPadding", () => {
  const raw: BaseGroupProps = {
    name: "g",
    schPadding: "1mm",
    schPaddingLeft: 2,
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.schPadding).toBe(1)
  expect(parsed.schPaddingLeft).toBe(2)
})
