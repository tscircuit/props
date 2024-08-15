import type { LayoutBuilder } from "@tscircuit/layout"
import {
  type AnySoupElementInput,
  capacitance,
  distance,
  inductance,
  layer_ref,
  length,
  point,
  resistance,
  rotation,
  route_hint_point,
  supplier_name,
  voltage,
} from "@tscircuit/soup"
import type { ReactElement } from "react"
import { z } from "zod"

export const portHints = z.array(z.string().or(z.number()))

export const direction = z.enum(["up", "down", "left", "right"])

export const relativeDirection = z.enum([
  "top-to-bottom",
  "left-to-right",
  "bottom-to-top",
  "right-to-left",
])

export const explicitPinSideDefinition = z.object({
  pins: z.array(z.number()),
  direction: z.union([
    z.literal("top-to-bottom"),
    z.literal("left-to-right"),
    z.literal("bottom-to-top"),
    z.literal("right-to-left"),
  ]),
})

export type Footprint = string | ReactElement | AnySoupElementInput[]
export const pcbLayoutProps = z.object({
  pcbX: distance,
  pcbY: distance,
  pcbRotation: rotation.optional(),
  layer: layer_ref.optional(),
})
export const commonLayoutProps = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbRotation: rotation.optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  layer: layer_ref.optional(),

  // TODO pull in literals from @tscircuit/footprint
  // TODO footprint can be a string or react child
  footprint: z.custom<Footprint>((v) => true).optional(),
})
export type CommonLayoutProps = z.input<typeof commonLayoutProps>

export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export type SupplierProps = z.input<typeof supplierProps>

const point3 = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  z: z.union([z.number(), z.string()]),
})

export const cadModelBase = z.object({
  rotationOffset: z.number().or(point3).optional(),
  positionOffset: point3.optional(),
  size: point3.optional(),
})

export const cadModelStl = cadModelBase.extend({
  stlUrl: z.string(),
})

export const cadModelObj = cadModelBase.extend({
  objUrl: z.string(),
  mtlUrl: z.string().optional(),
})

export const cadModelJscad = cadModelBase.extend({
  jscad: z.any(),
})

export const commonComponentProps = commonLayoutProps
  .merge(supplierProps)
  .extend({
    name: z.string(),
    cadModel: z.union([cadModelStl, cadModelObj, cadModelJscad]).optional(),
    children: z.any().optional(),
  })
export type CommonComponentProps = z.input<typeof commonComponentProps>

export const lrPins = ["pin1", "left", "pin2", "right"] as const
export const lrPolarPins = [
  "pin1",
  "left",
  "anode",
  "pos",
  "pin2",
  "right",
  "cathode",
  "neg",
] as const

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
  closed: z.boolean().optional(),
})
export const switchPins = z.object({
  p1: z.object({
    portNumber: z.number(),
  }),
  p2: z.object({
    portNumber: z.number(),
  }),
})
export type SwitchProps = z.input<typeof switchProps>
export type SwitchPins = z.input<typeof switchPins>

export const boardProps = z.object({
  width: distance,
  height: distance,
  pcbX: distance.optional().default(0),
  pcbY: distance.optional().default(0),
  layout: z.any().optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
})
export type BoardProps = z.input<typeof boardProps>

export const distanceOrMultiplier = distance.or(z.enum(["2x", "3x", "4x"]))

export const schematicPortArrangement = z
  .object({
    leftSize: z.number().optional(),
    topSize: z.number().optional(),
    rightSize: z.number().optional(),
    bottomSize: z.number().optional(),
  })
  .or(
    z.object({
      leftSide: explicitPinSideDefinition.optional(),
      rightSide: explicitPinSideDefinition.optional(),
      topSide: explicitPinSideDefinition.optional(),
      bottomSide: explicitPinSideDefinition.optional(),
    }),
  )

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z.record(z.number(), z.string()).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  schPinSpacing: distanceOrMultiplier
    .or(z.literal("auto"))
    .optional()
    .default("auto"),
  schWidth: distanceOrMultiplier
    .or(z.literal("auto"))
    .optional()
    .default("auto"),
})
/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type ChipProps = z.input<typeof chipProps>

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

export const traceProps = z
  .object({
    path: z.array(z.string()),
    thickness: distance.optional(),
    schematicRouteHints: z.array(point).optional(),
    pcbRouteHints: z.array(route_hint_point).optional(),
  })
  .or(
    z.object({
      from: z.string(),
      to: z.string(),
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

export const traceHintProps = z.object({
  for: z.string(),
  order: z.number().optional(),
  offset: route_hint_point.optional(),
  offsets: z.array(route_hint_point).optional(),
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
