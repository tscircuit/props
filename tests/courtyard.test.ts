import { expect, test } from "bun:test"
import {
  courtyardRectProps,
  type CourtyardRectProps,
} from "lib/components/courtyard-rect"
import {
  courtyardOutlineProps,
  type CourtyardOutlineProps,
} from "lib/components/courtyard-outline"
import {
  courtyardCircleProps,
  type CourtyardCircleProps,
} from "lib/components/courtyard-circle"
import {
  courtyardPillProps,
  type CourtyardPillProps,
} from "lib/components/courtyard-pill"

test("courtyard rect parses dimensions", () => {
  const rect: CourtyardRectProps = {
    width: 6,
    height: 4,
  }

  const parsed = courtyardRectProps.parse(rect)

  expect(parsed.width).toBe(6)
  expect(parsed.height).toBe(4)
  expect(parsed.strokeWidth).toBeUndefined()
  expect(parsed.isFilled).toBeUndefined()
  expect(parsed.hasStroke).toBeUndefined()
  expect(parsed.isStrokeDashed).toBeUndefined()
  expect(parsed.color).toBeUndefined()
})

test("courtyard rect accepts styling overrides", () => {
  const parsed = courtyardRectProps.parse({
    width: "4mm",
    height: "2mm",
    strokeWidth: "0.1mm",
    isFilled: false,
    hasStroke: true,
    isStrokeDashed: true,
    color: "#00ff00",
  })

  expect(parsed.width).toBeCloseTo(4)
  expect(parsed.height).toBeCloseTo(2)
  expect(parsed.strokeWidth).toBeCloseTo(0.1)
  expect(parsed.isFilled).toBe(false)
  expect(parsed.hasStroke).toBe(true)
  expect(parsed.isStrokeDashed).toBe(true)
  expect(parsed.color).toBe("#00ff00")
})

test("courtyard outline parses outline points", () => {
  const outline: CourtyardOutlineProps = {
    outline: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 },
      { x: 0, y: 5 },
    ],
    strokeWidth: 0.3,
    isClosed: true,
    isStrokeDashed: true,
    color: "#123456",
  }

  const parsed = courtyardOutlineProps.parse(outline)

  expect(parsed.outline).toHaveLength(4)
  expect(parsed.strokeWidth).toBe(0.3)
  expect(parsed.isClosed).toBe(true)
  expect(parsed.isStrokeDashed).toBe(true)
  expect(parsed.color).toBe("#123456")
})

test("courtyard circle parses radius", () => {
  const circle: CourtyardCircleProps = {
    radius: 3,
  }

  const parsed = courtyardCircleProps.parse(circle)

  expect(parsed.radius).toBe(3)
})

test("courtyard pill parses dimensions", () => {
  const pill: CourtyardPillProps = {
    width: 6,
    height: 2,
    radius: 1,
  }

  const parsed = courtyardPillProps.parse(pill)

  expect(parsed.width).toBe(6)
  expect(parsed.height).toBe(2)
  expect(parsed.radius).toBe(1)
})
