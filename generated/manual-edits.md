# Manual Edits Overview

> Generated at 2024-12-26T23:39:05.008Z
> This document provides an overview of manual edit types and interfaces in @tscircuit/props.

## Overview

This document describes the interfaces used for manual edits in the circuit editor. Manual edits
are used to track user modifications to the circuit, such as:

- Moving PCB components
- Moving schematic components
- Adding trace hints for routing

Each manual edit is represented by a specific event type that extends the base `ManualEditEvent`
interface. These events are stored in a `ManualEditsFile` which can be used to replay or
persist user modifications.

For validation, each interface has a corresponding zod validator that can be imported from the package.

For example:

```ts
import { manual_edits_file, type ManualEditsFile } from "@tscircuit/props"

// Validate/parse a manual edits file
const validatedFile = manual_edits_file.parse(unknownFile)
```

## Available Interfaces

```ts
export interface EditSchematicComponentLocationEvent
  extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_component_location"
  schematic_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface EditTraceHintEvent extends BaseManualEditEvent {
  /** @deprecated */
  pcb_edit_event_type: "edit_trace_hint"
  edit_event_type?: "edit_pcb_trace_hint"
  pcb_port_id: string
  pcb_trace_hint_id?: string
  route: Array<{ x: number; y: number; via?: boolean }>
}


export interface BaseManualEditEvent {
  edit_event_id: string
  in_progress?: boolean
  created_at: number
}


export interface EditPcbComponentLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_component_location"
  /** @deprecated */
  pcb_edit_event_type: "edit_component_location"
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface ManualTraceHint {
  pcb_port_selector: string
  offsets: Array<RouteHintPoint>
}


export interface ManualSchematicPlacement {
  selector: string
  relative_to: string
  center: Point
}


export interface ManualEditsFile {
  pcb_placements?: ManualPcbPlacement[]
  manual_trace_hints?: ManualTraceHint[]
  schematic_placements?: ManualSchematicPlacement[]
}


export interface ManualPcbPlacement {
  selector: string
  relative_to: string
  center: Point
}

```

## Circuit JSON Integration

The manual edit events integrate with the circuit-json format. For example, the `EditTraceHintEvent`
uses the `route_hint_point` type from circuit-json for defining trace routes.

For more details on the circuit-json format, see:
https://github.com/tscircuit/circuit-json
