# Manual Edits Documentation

## Table of Contents

- [Manual Edit Events](#manual-edit-events)
  - [BaseManualEditEvent](#basemanualeditevent)
  - [EditPcbComponentLocationEvent](#editpcbcomponentlocationevent)
  - [EditPcbGroupLocationEvent](#editpcbgrouplocationevent)
  - [EditSchematicComponentLocationEvent](#editschematiccomponentlocationevent)
  - [EditSchematicGroupLocationEvent](#editschematicgrouplocationevent)
  - [EditTraceHintEvent](#edittracehintevent)
- [Manual Edit Files](#manual-edit-files)
  - [ManualEditsFile](#manualeditsfile)
  - [ManualPcbPlacement](#manualpcbplacement)
  - [ManualSchematicPlacement](#manualschematicplacement)
  - [ManualTraceHint](#manualtracehint)

## Manual Edit Events

Events that represent manual edits to the circuit.

### BaseManualEditEvent

```typescript
interface BaseManualEditEvent {
  edit_event_id: string
  in_progress?: boolean
  created_at: number
}
```

### EditPcbComponentLocationEvent

@deprecated

```typescript
interface EditPcbComponentLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_component_location"
  /** @deprecated */
  pcb_edit_event_type: "edit_component_location"
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}
```

### EditPcbGroupLocationEvent

```typescript
interface EditPcbGroupLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_group_location"
  pcb_group_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}
```

### EditSchematicComponentLocationEvent

```typescript
interface EditSchematicComponentLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_component_location"
  schematic_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}
```

### EditSchematicGroupLocationEvent

```typescript
interface EditSchematicGroupLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_group_location"
  schematic_group_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}
```

### EditTraceHintEvent

@deprecated

```typescript
interface EditTraceHintEvent extends BaseManualEditEvent {
  /** @deprecated */
  pcb_edit_event_type: "edit_trace_hint"
  edit_event_type?: "edit_pcb_trace_hint"
  pcb_port_id: string
  pcb_trace_hint_id?: string
  route: Array<{ x: number; y: number; via?: boolean }>
}
```

## Manual Edit Files

File structures that store manual edits.

### ManualEditsFile

```typescript
interface ManualEditsFile {
  pcb_placements?: ManualPcbPlacement[]
  manual_trace_hints?: ManualTraceHint[]
  schematic_placements?: ManualSchematicPlacement[]
}
```

### ManualPcbPlacement

```typescript
interface ManualPcbPlacement {
  selector: string
  relative_to: string
  center: Point
}
```

### ManualSchematicPlacement

```typescript
interface ManualSchematicPlacement {
  selector: string
  relative_to: string
  center: Point
}
```

### ManualTraceHint

```typescript
interface ManualTraceHint {
  pcb_port_selector: string
  offsets: Array<RouteHintPoint>
}
```

