# Circuit JSON Specification: PCB Component Overview

> Created at 2024-10-23T22:17:25.274Z
> Latest Version: https://github.com/tscircuit/circuit-json/blob/main/docs/PCB_COMPONENT_OVERVIEW.md

Any type below can be imported from `circuit-json`. Every type has a corresponding
snake_case version which is a zod type that can be used to parse unknown json,
for example `PcbComponent` has a `pcb_component.parse` function that you
can also import.

```ts
export interface PcbFabricationNotePath {
  type: "pcb_fabrication_note_path"
  pcbFabricationNotePathId: string
  pcbComponentId: string
  layer: LayerRef
  route: Point[]
  strokeWidth: Length
  color?: string
}

export interface PcbComponent {
  type: "pcb_component"
  pcbComponentId: string
  sourceComponentId: string
  center: Point
  layer: LayerRef
  rotation: Rotation
  width: Length
  height: Length
}

export interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcbErrorId: string
  message: string
  pcbComponentIds: string[]
}

export interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcbSolderPasteId: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcbComponentId?: string
  pcbSmtpadId?: string
}

export interface PcbSolderPasteRect {
  type: "pcb_solder_paste"
  shape: "rect"
  pcbSolderPasteId: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  pcbComponentId?: string
  pcbSmtpadId?: string
}

export type PcbSolderPaste = PcbSolderPasteCircle | PcbSolderPasteRect

export interface PcbSilkscreenText {
  type: "pcb_silkscreen_text"
  pcbSilkscreenTextId: string
  font: "tscircuit2024"
  fontSize: Length
  pcbComponentId: string
  text: string
  layer: LayerRef
  isMirrored?: boolean
  anchorPosition: Point
  anchorAlignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
}

export interface PcbTraceError {
  type: "pcb_trace_error"
  pcbTraceErrorId: string
  errorType: "pcb_trace_error"
  message: string
  center?: Point
  pcbTraceId: string
  sourceTraceId: string
  pcbComponentIds: string[]
  pcbPortIds: string[]
}

export interface PcbSilkscreenPill {
  type: "pcb_silkscreen_pill"
  pcbSilkscreenPillId: string
  pcbComponentId: string
  center: Point
  width: Length
  height: Length
  layer: LayerRef
}

export interface PcbPlatedHoleCircle {
  type: "pcb_plated_hole"
  shape: "circle"
  outerDiameter: number
  holeDiameter: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  portHints?: string[]
  pcbComponentId?: string
  pcbPortId?: string
  pcbPlatedHoleId: string
}

export interface PcbPlatedHoleOval {
  type: "pcb_plated_hole"
  shape: "oval" | "pill"
  outerWidth: number
  outerHeight: number
  holeWidth: number
  holeHeight: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  portHints?: string[]
  pcbComponentId?: string
  pcbPortId?: string
  pcbPlatedHoleId: string
}

export interface PcbHoleCircularWithSquarePlated {
  type: "pcb_plated_hole"
  shape: "circular_hole_with_square_pad"
  holeShape: "circle"
  padShape: "square"
  holeDiameter: number
  squarePadWidth: number
  squarePadHeight: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  portHints?: string[]
  pcbComponentId?: string
  pcbPortId?: string
  pcbPlatedHoleId: string
}

export type PcbPlatedHole = PcbPlatedHoleCircle | PcbPlatedHoleOval | PcbHoleCircularWithSquarePlated

export interface PcbFabricationNoteText {
  type: "pcb_fabrication_note_text"
  pcbFabricationNoteTextId: string
  font: "tscircuit2024"
  fontSize: Length
  pcbComponentId: string
  text: string
  layer: VisibleLayer
  anchorPosition: Point
  anchorAlignment:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  color?: string
}

export interface PcbSilkscreenCircle {
  type: "pcb_silkscreen_circle"
  pcbSilkscreenCircleId: string
  pcbComponentId: string
  center: Point
  radius: Length
  layer: VisibleLayer
}

export interface PcbSilkscreenPath {
  type: "pcb_silkscreen_path"
  pcbSilkscreenPathId: string
  pcbComponentId: string
  layer: VisibleLayerRef
  route: Point[]
  strokeWidth: Length
}

export interface PcbText {
  type: "pcb_text"
  pcbTextId: string
  text: string
  center: Point
  layer: LayerRef
  width: Length
  height: Length
  lines: number
  align: "bottom-left"
}

export interface PcbKeepout {
  type: "pcb_keepout"
  shape: "rect" | "circle"
  center: Point
  width?: Distance
  height?: Distance
  radius?: Distance
  pcbKeepoutId: string
  layers: string[]
  description?: string
}

export interface PcbVia {
  type: "pcb_via"
  pcbViaId: string
  x: Distance
  y: Distance
  outerDiameter: Distance
  holeDiameter: Distance
  layers: LayerRef[]
  pcbTraceId?: string
}

export interface PcbSilkscreenOval {
  type: "pcb_silkscreen_oval"
  pcbSilkscreenOvalId: string
  pcbComponentId: string
  center: Point
  radiusX: Distance
  radiusY: Distance
  layer: VisibleLayer
}

export interface PcbPlacementError {
  type: "pcb_placement_error"
  pcbPlacementErrorId: string
  message: string
}

export interface PcbPort {
  type: "pcb_port"
  pcbPortId: string
  sourcePortId: string
  pcbComponentId: string
  x: Distance
  y: Distance
  layers: LayerRef[]
}

export interface PcbSmtPadCircle {
  type: "pcb_smtpad"
  shape: "circle"
  pcbSmtpadId: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  portHints?: string[]
  pcbComponentId?: string
  pcbPortId?: string
}

export interface PcbSmtPadRect {
  type: "pcb_smtpad"
  shape: "rect"
  pcbSmtpadId: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  portHints?: string[]
  pcbComponentId?: string
  pcbPortId?: string
}

export type PcbSmtPad = PcbSmtPadCircle | PcbSmtPadRect

export interface PcbSilkscreenLine {
  type: "pcb_silkscreen_line"
  pcbSilkscreenLineId: string
  pcbComponentId: string
  strokeWidth: Distance
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  layer: VisibleLayer
}

export interface PcbHoleCircleOrSquare {
  type: "pcb_hole"
  pcbHoleId: string
  holeShape: "circle" | "square"
  holeDiameter: number
  x: Distance
  y: Distance
}

export interface PcbHoleOval {
  type: "pcb_hole"
  pcbHoleId: string
  holeShape: "oval"
  holeWidth: number
  holeHeight: number
  x: Distance
  y: Distance
}

export type PcbHole = PcbHoleCircleOrSquare | PcbHoleOval

export interface PcbTraceRoutePointWire {
  routeType: "wire"
  x: Distance
  y: Distance
  width: Distance
  startPcbPortId?: string
  endPcbPortId?: string
  layer: LayerRef
}

export interface PcbTraceRoutePointVia {
  routeType: "via"
  x: Distance
  y: Distance
  fromLayer: string
  toLayer: string
}

export type PcbTraceRoutePoint = PcbTraceRoutePointWire | PcbTraceRoutePointVia

export interface PcbTrace {
  type: "pcb_trace"
  sourceTraceId?: string
  pcbComponentId?: string
  pcbTraceId: string
  routeOrderIndex?: number
  routeThicknessMode?: "constant" | "interpolated"
  shouldRoundCorners?: boolean
  route: Array<PcbTraceRoutePoint>
}

export interface PcbBoard {
  type: "pcb_board"
  pcbBoardId: string
  width: Length
  height: Length
  thickness: Length
  numLayers: number
  center: Point
  outline?: Point[]
}
```
