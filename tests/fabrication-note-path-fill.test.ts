import { expect, test } from "bun:test"
import "bun-match-svg"
import type { CircuitJson, PcbFabricationNotePath } from "circuit-json"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import {
  fabricationNotePathProps,
  type FabricationNotePathProps,
} from "lib/components/fabrication-note-path"

test("fabrication path props preserve fill modes and legacy defaults", async () => {
  const route = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 3 },
    { x: 0, y: 3 },
  ]
  const legacy = fabricationNotePathProps.parse({ route })
  expect(legacy.isFilled).toBeUndefined()
  expect(legacy.hasStroke).toBeUndefined()
  for (const flag of ["isFilled", "hasStroke"]) {
    expect(
      fabricationNotePathProps.safeParse({ route, [flag]: "false" }).success,
    ).toBe(false)
  }
  const modes: FabricationNotePathProps[] = [
    { route, isFilled: true, hasStroke: false, strokeWidth: "0mm" },
    { route, isFilled: true, hasStroke: true, strokeWidth: "0.2mm" },
    { route, isFilled: false, hasStroke: true, strokeWidth: "0.2mm" },
  ]
  const circuitJson: CircuitJson = modes.flatMap((mode, index) => {
    const parsed = fabricationNotePathProps.parse(mode)
    expect(parsed.isFilled).toBe(mode.isFilled)
    expect(parsed.hasStroke).toBe(mode.hasStroke)
    const path: PcbFabricationNotePath = {
      type: "pcb_fabrication_note_path",
      pcb_fabrication_note_path_id: `path-${index}`,
      pcb_component_id: "component",
      layer: "top",
      route: parsed.route.map((p) => ({ x: p.x + index * 5, y: p.y })),
      stroke_width: parsed.strokeWidth ?? 0.1,
      is_filled: parsed.isFilled,
      has_stroke: parsed.hasStroke,
    }
    return [
      path,
      {
        type: "pcb_fabrication_note_text",
        pcb_fabrication_note_text_id: `label-${index}`,
        pcb_component_id: "component",
        layer: "top",
        text: ["FILL ONLY", "FILL + STROKE", "STROKE ONLY"][index]!,
        anchor_position: { x: index * 5 + 1.5, y: 4 },
        anchor_alignment: "center",
        font_size: 0.5,
        font: "tscircuit2024",
        color: "white",
      },
    ]
  })
  await expect(
    convertCircuitJsonToPcbSvg(circuitJson, { includeVersion: false }),
  ).toMatchSvgSnapshot(import.meta.path)
})
