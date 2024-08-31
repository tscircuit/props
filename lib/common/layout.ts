import { z } from "zod"
import {
  type AnySoupElementInput,
  distance,
  layer_ref,
  type LayerRef,
  type LayerRefInput,
  rotation,
  supplier_name,
} from "@tscircuit/soup"
import { point3 } from "./point3"
import {
  cadModelJscad,
  cadModelObj,
  cadModelProp,
  cadModelStl,
  type CadModelJscad,
  type CadModelObj,
  type CadModelProp,
  type CadModelStl,
} from "./cadModel"
import { footprintProp, type Footprint } from "./footprintProp"
import { expectTypesMatch } from "lib/typecheck"

export const pcbLayoutProps = z.object({
  pcbX: distance,
  pcbY: distance,
  pcbRotation: rotation.optional(),
  layer: layer_ref.optional(),
})

export interface CommonLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number

  schX?: string | number
  schY?: string | number
  schRotation?: string | number

  layer?: LayerRefInput
  footprint?: Footprint
}

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

type InferredCommonLayoutProps = z.input<typeof commonLayoutProps>
expectTypesMatch<CommonLayoutProps, InferredCommonLayoutProps>(true)

export type SupplierName =
  | "jlcpcb"
  | "macrofab"
  | "pcbway"
  | "digikey"
  | "mouser"
  | "lcsc"
export interface SupplierProps {
  supplierPartNumbers?: { [k in SupplierName]?: string[] }
}
export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})

expectTypesMatch<SupplierProps, z.input<typeof supplierProps>>(true)

export interface CommonComponentProps extends CommonLayoutProps {
  name: string
  supplierPartNumbers?: SupplierProps["supplierPartNumbers"]
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
}

export const commonComponentProps = commonLayoutProps
  .merge(supplierProps)
  .extend({
    name: z.string(),
    cadModel: cadModelProp.optional(),
    children: z.any().optional(),
    symbolName: z.string().optional(),
  })

type InferredCommonComponentProps = z.input<typeof commonComponentProps>
expectTypesMatch<CommonComponentProps, InferredCommonComponentProps>(true)

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
