import { expect, test } from "bun:test"
import { pcbTraceProps, type PcbTraceProps } from "../lib/components/pcb-trace"

test("pcbtrace parses wire shorthand units and complete route points", () => {
  const props: PcbTraceProps = {
    layer: "top",
    thickness: "0.2mm",
    route: [
      { x: "-4mm", y: "0mm" },
      { x: 0, y: "2mm", trace_width: "0.4mm" },
      {
        route_type: "via",
        x: 2,
        y: 2,
        from_layer: "top",
        to_layer: "bottom",
      },
      { x: 4, y: 0 },
    ],
  }
  expect(pcbTraceProps.parse(props)).toEqual({
    layer: "top",
    thickness: 0.2,
    route: [
      { x: -4, y: 0 },
      { x: 0, y: 2, trace_width: 0.4 },
      {
        route_type: "via",
        x: 2,
        y: 2,
        from_layer: "top",
        to_layer: "bottom",
      },
      { x: 4, y: 0 },
    ],
  })
  expect(pcbTraceProps.parse({ route: [] })).toEqual({ route: [] })
})

test("pcbtrace preserves complete Circuit JSON points and their metadata", () => {
  const wire = {
    route_type: "wire",
    x: "0mm",
    y: "1mm",
    width: "0.4mm",
    layer: "top",
    start_width: "0.4mm",
    end_width: "0.2mm",
    width_interpolation_mode: "linear",
    start_pcb_port_id: "pcb_port_start",
    copper_pour_id: "pcb_copper_pour_1",
    is_inside_copper_pour: true,
  } as const
  const via = {
    route_type: "via",
    x: 2,
    y: 1,
    from_layer: "top",
    to_layer: "bottom",
    hole_diameter: "0.3mm",
    outer_diameter: "0.6mm",
    tented_on_top: true,
    tented_on_bottom: false,
  } as const
  const throughPad = {
    route_type: "through_pad",
    start: { x: 2, y: 1 },
    end: { x: 3, y: 1 },
    width: "0.5mm",
    start_layer: "bottom",
    end_layer: "top",
    pcb_plated_hole_id: "pcb_plated_hole_1",
  } as const
  const end = { x: 4, y: 1 }
  const props = {
    route: [wire, via, throughPad, end],
  } satisfies PcbTraceProps
  const original = structuredClone(props)
  expect(pcbTraceProps.parse(props).route).toEqual([
    {
      ...wire,
      x: 0,
      y: 1,
      width: 0.4,
      start_width: 0.4,
      end_width: 0.2,
    },
    { ...via, hole_diameter: 0.3, outer_diameter: 0.6 },
    { ...throughPad, width: 0.5 },
    end,
  ])
  expect(props).toEqual(original)
})

test("pcbtrace rejects malformed explicit points instead of stripping their fields", () => {
  const wire = { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" }
  for (const point of [
    { ...wire, route_type: "unknown" },
    { ...wire, width: false },
    { ...wire, layer: "middle" },
    { route_type: "wire", x: 0, y: 0 },
    { route_type: "via", x: 0, y: 0 },
    {
      ...wire,
      start_width: -0.2,
      end_width: 0.3,
      width_interpolation_mode: "linear",
    },
  ]) {
    expect(pcbTraceProps.safeParse({ route: [point] }).success).toBe(false)
  }
  expect(pcbTraceProps.safeParse({ layer: "middle", route: [] }).success).toBe(
    false,
  )
})

test("pcbtrace coordinate shorthand is limited to wires", () => {
  for (const point of [
    { x: 0, y: 0, via: true },
    { x: 0, y: 0, via: "yes" },
    { x: 0, y: 0, via: true, to_layer: "bottom" },
    { x: 0, y: 0, via: true, to_layer: "middle" },
    { x: 0, y: 0, to_layer: "bottom" },
    { x: 0, y: 0, via: false, to_layer: "bottom" },
    { x: 0, y: 0, trace_width: false },
    { x: 0, y: 0, width: 0.2, layer: "top" },
  ]) {
    expect(pcbTraceProps.safeParse({ route: [point] }).success).toBe(false)
  }
})
