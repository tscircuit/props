import { expect, test } from "bun:test"
import { manualEditsProps } from "lib/manual-edits/manual_edits_file"

test("should transform camelCase to include underscore keys", () => {
  const input = {
    pcbPlacements: [
      { selector: "pcb1", relative_to: "board", center: { x: 0, y: 0 } },
    ],
    manualTraceHints: [
      { pcb_port_selector: "port1", offsets: [{ x: 1, y: 1 }] },
    ],
    schematicPlacements: [
      { selector: "sch1", relative_to: "board", center: { x: 0, y: 0 } },
    ],
  }
  const parsed = manualEditsProps.parse(input)
  expect(parsed).toHaveProperty("pcbPlacements")
  expect(parsed).toHaveProperty("pcb_placements")
  expect(parsed.pcb_placements).toEqual(input.pcbPlacements)
  expect(parsed).toHaveProperty("manualTraceHints")
  expect(parsed).toHaveProperty("manual_trace_hints")
  expect(parsed.manual_trace_hints).toEqual(input.manualTraceHints)
  expect(parsed).toHaveProperty("schematicPlacements")
  expect(parsed).toHaveProperty("schematic_placements")
  expect(parsed.schematic_placements).toEqual(input.schematicPlacements)
})

test("should transform underscore keys to include camelCase", () => {
  const input = {
    pcb_placements: [
      { selector: "pcb1", relative_to: "board", center: { x: 0, y: 0 } },
    ],
    manual_trace_hints: [
      { pcb_port_selector: "port1", offsets: [{ x: 1, y: 1 }] },
    ],
    schematic_placements: [
      { selector: "sch1", relative_to: "board", center: { x: 0, y: 0 } },
    ],
  }
  const parsed = manualEditsProps.parse(input)
  expect(parsed).toHaveProperty("pcbPlacements")
  expect(parsed).toHaveProperty("pcb_placements")
  expect(parsed.pcbPlacements).toEqual(input.pcb_placements)
  expect(parsed).toHaveProperty("manualTraceHints")
  expect(parsed).toHaveProperty("manual_trace_hints")
  expect(parsed.manualTraceHints).toEqual(input.manual_trace_hints)
  expect(parsed).toHaveProperty("schematicPlacements")
  expect(parsed).toHaveProperty("schematic_placements")
  expect(parsed.schematicPlacements).toEqual(input.schematic_placements)
})
