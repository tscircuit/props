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

test("should parse layout padding", () => {
  const raw: BaseGroupProps = {
    name: "g",
    padding: "1mm",
    paddingLeft: "0.5mm",
    paddingX: "2mm",
    paddingY: 1,
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.padding).toBe(1)
  expect(parsed.paddingLeft).toBe(0.5)
  expect(parsed.paddingX).toBe(2)
  expect(parsed.paddingY).toBe(1)
})

test("should parse schTitle", () => {
  const raw: BaseGroupProps = {
    name: "g",
    schTitle: "My Group",
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.schTitle).toBe("My Group")
})

test("should parse relative flags", () => {
  const raw: BaseGroupProps = {
    name: "g",
    relative: true,
    schRelative: true,
    pcbRelative: true,
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.relative).toBe(true)
  expect(parsed.schRelative).toBe(true)
  expect(parsed.pcbRelative).toBe(true)
})

test("should parse relative layout mode", () => {
  const raw: BaseGroupProps = {
    name: "g",
    layoutMode: "relative",
  }

  const parsed = baseGroupProps.parse(raw)
  expect(parsed.layoutMode).toBe("relative")
})
