import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { cadModelBase, type CadModelBase } from "../common/cadModel"
import { z } from "zod"

export interface CadModelProps extends CadModelBase {
  modelUrl: string
  stepUrl?: string
  pcbX?: Distance
  pcbY?: Distance
  pcbOffsetX?: Distance
  pcbOffsetY?: Distance
  pcbZ?: Distance
}

const pcbPosition = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbOffsetX: distance.optional(),
  pcbOffsetY: distance.optional(),
  pcbZ: distance.optional(),
})

const cadModelBaseWithUrl = cadModelBase.extend({
  modelUrl: z.string(),
  stepUrl: z.string().optional(),
})

const cadModelObject = cadModelBaseWithUrl.merge(pcbPosition)
expectTypesMatch<CadModelProps, z.input<typeof cadModelObject>>(true)

export const cadmodelProps = z.union([z.null(), z.string(), cadModelObject])

export type CadModelPropsInput = z.input<typeof cadmodelProps>
