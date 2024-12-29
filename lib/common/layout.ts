import {
  type LayerRefInput,
  distance,
  layer_ref,
  rotation,
  supplier_name,
} from "circuit-json"
import { expectTypesMatch } from "../typecheck"
import { z } from "zod"
import { type CadModelProp, cadModelProp } from "./cadModel"
import { type Footprint, footprintProp } from "./footprintProp"

export interface PcbLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  layer?: LayerRefInput
}

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

export const pcbLayoutProps = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbRotation: rotation.optional(),
  layer: layer_ref.optional(),
})
type InferredPcbLayoutProps = z.input<typeof pcbLayoutProps>
expectTypesMatch<PcbLayoutProps, InferredPcbLayoutProps>(true)

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
export type SupplierPartNumbers = { [k in SupplierName]?: string[] }
export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}
export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})

expectTypesMatch<SupplierProps, z.input<typeof supplierProps>>(true)

export interface CommonComponentProps extends CommonLayoutProps {
  key?: any
  name: string
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
}

export const commonComponentProps = commonLayoutProps
  .merge(supplierProps)
  .extend({
    key: z.any().optional(),
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
