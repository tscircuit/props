/**
 * THINKING ABOUT ADDING SOMETHING TO THIS FILE?
 *
 * THINK AGAIN!
 *
 * This file is TOO BIG! Create files using the pattern in the surrounding
 * directories, then export from this file.
 */
import type { LayoutBuilder } from "@tscircuit/layout"
import {
  type AnySoupElementInput,
  capacitance,
  distance,
  inductance,
  layer_ref,
  length,
  type PCBPlatedHoleInput,
  type PCBSMTPadInput,
  point,
  resistance,
  rotation,
  route_hint_point,
  supplier_name,
  voltage,
} from "circuit-json"
import type { ReactElement } from "react"
import { z } from "zod"
import { direction } from "./common/direction"
import { portHints } from "./common/portHints"
import {
  commonComponentProps,
  commonLayoutProps,
  lrPins,
  lrPolarPins,
  pcbLayoutProps,
} from "./common/layout"
import { explicitPinSideDefinition } from "./common/schematicPinDefinitions"

export * from "./common/direction"
export * from "./common/portHints"
export * from "./common/layout"
export * from "./common/point3"
export * from "./common/portHints"
export * from "./common/footprintProp"
export * from "./common/schematicPinDefinitions"
export * from "./common/schematicPinStyle"
export * from "./common/cadModel"

export * from "./components/board"
export * from "./components/chip"
export * from "./components/jumper"
export * from "./components/platedhole"

export * from "./components/resistor"
export * from "./components/capacitor"
export * from "./components/group"
export * from "./components/net"
export * from "./components/constrainedlayout"
export * from "./components/constraint"
export * from "./components/smtpad"
export * from "./components/solderpaste"
export * from "./components/hole"
export * from "./components/trace"
export * from "./components/footprint"
export * from "./components/battery"
export * from "./components/pin-header"
export * from "./components/netalias"
export * from "./components/push-button"
export * from "./components/potentiometer"

export const inductorProps = commonComponentProps.extend({
  inductance,
})
export const inductorPins = lrPins
export type InductorProps = z.input<typeof inductorProps>

export const diodeProps = commonComponentProps.extend({})
export const diodePins = lrPolarPins
export type DiodeProps = z.input<typeof diodeProps>

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>

export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
})
export type SwitchProps = z.input<typeof switchProps>

export const distanceOrMultiplier = distance.or(z.enum(["2x", "3x", "4x"]))

export const viaProps = commonLayoutProps.extend({
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
})
export type ViaProps = z.input<typeof viaProps>

export const pcbKeepoutProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
  }),
  pcbLayoutProps.extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  }),
])
export type PcbKeepoutProps = z.input<typeof pcbKeepoutProps>

export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>

export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
})
export type SchematicLineProps = z.input<typeof schematicLineProps>

export const schematicPathProps = z.object({
  points: z.array(point),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
export type SchematicPathProps = z.input<typeof schematicPathProps>

export const componentProps = commonComponentProps
export type ComponentProps = z.input<typeof componentProps>

export const powerSourceProps = commonComponentProps.extend({
  voltage,
})
export type PowerSourceProps = z.input<typeof powerSourceProps>

export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
})
export type PortProps = z.input<typeof portProps>

export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>

export const silkscreenPathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
  })
export type SilkscreenPathProps = z.input<typeof silkscreenPathProps>

export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    strokeWidth: distance,
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
  })
export type SilkscreenLineProps = z.input<typeof silkscreenLineProps>

export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    width: distance,
    height: distance,
  })
export type SilkscreenRectProps = z.input<typeof silkscreenRectProps>

export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    radius: distance,
  })
export type SilkscreenCircleProps = z.input<typeof silkscreenCircleProps>

export const routeHintPointProps = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  toLayer: layer_ref.optional(),
})

export const traceHintProps = z.object({
  for: z
    .string()
    .optional()
    .describe(
      "Selector for the port you're targeting, not required if you're inside a trace",
    ),
  order: z.number().optional(),
  offset: route_hint_point.or(routeHintPointProps).optional(),
  offsets: z
    .array(route_hint_point)
    .or(z.array(routeHintPointProps))
    .optional(),
  traceWidth: z.number().optional(),
})

export type TraceHintProps = z.input<typeof traceHintProps>

export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>

export const fabricationNoteTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  color: z.string().optional(),
})
export type FabricationNoteTextProps = z.input<typeof fabricationNoteTextProps>

export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
