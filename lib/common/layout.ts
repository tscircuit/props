import {
  type LayerRefInput,
  distance,
  layer_ref,
  rotation,
  supplier_name,
} from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type CadModelProp, cadModelProp } from "./cadModel"
import { type FootprintProp, footprintProp } from "./footprintProp"

export interface PcbLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  layer?: LayerRefInput
  layers?: LayerRefInput[]
  /**
   * If true, pcbX/pcbY will be interpreted relative to the parent group
   */
  pcbRelative?: boolean
  /**
   * If true, both pcb and schematic coordinates will be interpreted relative to the parent group
   */
  relative?: boolean
}

export interface CommonLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number

  schX?: string | number
  schY?: string | number
  schRotation?: string | number

  layer?: LayerRefInput
  footprint?: FootprintProp

  /**
   * If true, X/Y coordinates will be interpreted relative to the parent group
   */
  relative?: boolean

  /**
   * If true, schX/schY will be interpreted relative to the parent group
   */
  schRelative?: boolean

  /**
   * If true, pcbX/pcbY will be interpreted relative to the parent group
   */
  pcbRelative?: boolean
}

export const pcbLayoutProps = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbRotation: rotation.optional(),
  layer: layer_ref.optional(),
  layers: z.array(layer_ref).optional(),
  pcbRelative: z.boolean().optional(),
  relative: z.boolean().optional(),
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
  relative: z.boolean().optional(),
  schRelative: z.boolean().optional(),
  pcbRelative: z.boolean().optional(),
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

export interface PinAttributeMap {
  providesPower?: boolean
  requiresPower?: boolean
  providesGround?: boolean
  requiresGround?: boolean
  providesVoltage?: string | number
  requiresVoltage?: string | number
}

export const pinAttributeMap = z.object({
  providesPower: z.boolean().optional(),
  requiresPower: z.boolean().optional(),
  providesGround: z.boolean().optional(),
  requiresGround: z.boolean().optional(),
  providesVoltage: z.union([z.string(), z.number()]).optional(),
  requiresVoltage: z.union([z.string(), z.number()]).optional(),
})

expectTypesMatch<PinAttributeMap, z.input<typeof pinAttributeMap>>(true)

export interface CommonComponentProps<PinLabel extends string = string>
  extends CommonLayoutProps {
  key?: any
  name: string
  pinAttributes?: Record<PinLabel, PinAttributeMap>
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
  doNotPlace?: boolean
}

export const commonComponentProps = commonLayoutProps
  .merge(supplierProps)
  .extend({
    key: z.any().optional(),
    name: z.string(),
    cadModel: cadModelProp.optional(),
    children: z.any().optional(),
    symbolName: z.string().optional(),
    doNotPlace: z.boolean().optional(),
    pinAttributes: z.record(z.string(), pinAttributeMap).optional(),
  })

type InferredCommonComponentProps = z.input<typeof commonComponentProps>
expectTypesMatch<CommonComponentProps, InferredCommonComponentProps>(true)

export const componentProps = commonComponentProps
export type ComponentProps = z.input<typeof componentProps>

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
