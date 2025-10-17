import { expect, test } from "bun:test"
import {
  fabricationNoteRectProps,
  type FabricationNoteRectProps,
} from "lib/components/fabrication-note-rect"
import {
  fabricationNotePathProps,
  type FabricationNotePathProps,
} from "lib/components/fabrication-note-path"

test("fabrication note rect parses minimal props", () => {
  const rect: FabricationNoteRectProps = {
    pcbX: 10,
    pcbY: 12,
    width: 5,
    height: 4,
  }

  const parsed = fabricationNoteRectProps.parse(rect)

  expect(parsed.pcbX).toBe(10)
  expect(parsed.pcbY).toBe(12)
  expect(parsed.width).toBe(5)
  expect(parsed.height).toBe(4)
  expect(parsed.strokeWidth).toBeUndefined()
  expect(parsed.isFilled).toBeUndefined()
  expect(parsed.hasStroke).toBeUndefined()
  expect(parsed.isStrokeDashed).toBeUndefined()
  expect(parsed.color).toBeUndefined()
})

test("fabrication note rect accepts pcb offsets and position mode", () => {
  const rect = {
    pcbOffsetX: "2mm",
    pcbOffsetY: 3,
    pcbPositionMode: "relative_to_group_anchor" as const,
    width: 5,
    height: 4,
  }

  const parsed = fabricationNoteRectProps.parse(rect)

  expect(parsed.pcbOffsetX).toBeCloseTo(2)
  expect(parsed.pcbOffsetY).toBe(3)
  expect(parsed.pcbPositionMode).toBe("relative_to_group_anchor")
})

test("fabrication note rect allows styling overrides", () => {
  const parsed = fabricationNoteRectProps.parse({
    width: "3mm",
    height: "2mm",
    strokeWidth: "0.2mm",
    isFilled: true,
    hasStroke: true,
    isStrokeDashed: true,
    color: "#ff00ff",
  })

  expect(parsed.width).toBeCloseTo(3)
  expect(parsed.height).toBeCloseTo(2)
  expect(parsed.strokeWidth).toBeCloseTo(0.2)
  expect(parsed.isFilled).toBe(true)
  expect(parsed.hasStroke).toBe(true)
  expect(parsed.isStrokeDashed).toBe(true)
  expect(parsed.color).toBe("#ff00ff")
})

test("fabrication note path parses route points", () => {
  const path: FabricationNotePathProps = {
    route: [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 },
    ],
    strokeWidth: 0.5,
    color: "#0000ff",
  }

  const parsed = fabricationNotePathProps.parse(path)

  expect(parsed.route).toHaveLength(3)
  expect(parsed.strokeWidth).toBe(0.5)
  expect(parsed.color).toBe("#0000ff")
})
