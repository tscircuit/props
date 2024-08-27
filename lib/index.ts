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
} from "@tscircuit/soup"
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

export * from "./components/board"
export * from "./components/chip"

export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export type SupplierProps = z.input<typeof supplierProps>

export const resistorProps = commonComponentProps.extend({
  resistance,
})
export const resistorPins = lrPins
export type ResistorProps = z.input<typeof resistorProps>

export const capacitorProps = commonComponentProps.extend({
  capacitance,
})
export const capacitorPins = lrPolarPins
export type CapacitorProps = z.input<typeof capacitorProps>

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

export const netAliasProps = commonLayoutProps.extend({
  net: z.string().optional(),
})
export type NetAliasProps = z.input<typeof netAliasProps>

export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])

export const traceProps = z
  .object({
    path: z.array(portRef),
    thickness: distance.optional(),
    schematicRouteHints: z.array(point).optional(),
    pcbRouteHints: z.array(route_hint_point).optional(),
  })
  .or(
    z.object({
      from: portRef,
      to: portRef,
      thickness: distance.optional(),
      schematicRouteHints: z.array(point).optional(),
      pcbRouteHints: z.array(route_hint_point).optional(),
    }),
  )
export type TraceProps = z.input<typeof traceProps>

export const smtPadProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance.optional(),
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("rect"),
    width: distance.optional(),
    height: distance.optional(),
    portHints: portHints.optional(),
  }),
])
export type SmtPadProps = z.input<typeof smtPadProps>

export const platedHoleProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    shape: z.literal("circle"),
    holeDiameter: distance,
    outerDiameter: distance,
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    shape: z.literal("oval"),
    outerWidth: distance,
    outerHeight: distance,
    innerWidth: distance,
    innerHeight: distance,
    portHints: portHints.optional(),
  }),
])
export type PlatedHoleProps = z.input<typeof platedHoleProps>

export const holeProps = pcbLayoutProps.omit({ pcbRotation: true }).extend({
  holeDiameter: distance,
})
export type HoleProps = z.input<typeof holeProps>

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

export const constraintProps = z.union([
  z.object({
    type: z.literal("xdist"),
    dist: distance,
    left: z.string(),
    right: z.string(),
  }),
  z.object({
    type: z.literal("ydist"),
    dist: distance,
    top: z.string(),
    bottom: z.string(),
  }),
])
export type ConstraintProps = z.input<typeof constraintProps>

export const constrainedLayoutProps = z.object({})
export type ConstrainedLayoutProps = z.input<typeof constrainedLayoutProps>

export const footprintProps = z.object({})
export type FootprintProps = z.input<typeof footprintProps>

export const componentProps = commonComponentProps
export type ComponentProps = z.input<typeof componentProps>

export const groupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  children: z.any().optional(),
  routingDisabled: z.boolean().optional(),
})
export type GroupProps = z.input<typeof groupProps>

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
})
export type FabricationNoteTextProps = z.input<typeof fabricationNoteTextProps>

export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
  })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
