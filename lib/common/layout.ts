import type { ReactElement } from "react"
import { z } from "zod"
import {
  type AnySoupElementInput,
  distance,
  layer_ref,
  rotation,
  supplier_name,
} from "@tscircuit/soup"
import { point3 } from "./point3"
import { cadModelJscad, cadModelObj, cadModelStl } from "./cadModel"
import { footprintProp } from "./footprintProp"

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
  footprint: footprintProp.optional(),
})
export type CommonLayoutProps = z.input<typeof commonLayoutProps>

export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export type SupplierProps = z.input<typeof supplierProps>

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

export const distanceOrMultiplier = distance.or(z.enum(["2x", "3x", "4x"]))
