import { distance, type Distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { cadModelBase, type CadModelBase } from "../common/cadModel"
import { z } from "zod"

export interface CadModelProps extends CadModelBase {
  modelUrl: string
  pcbX?: Distance
  pcbY?: Distance
  pcbZ?: Distance
}

const pcbPosition = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbZ: distance.optional(),
})

const cadModelBaseWithUrl = cadModelBase.extend({
  modelUrl: z.string(),
})

const cadModelObject = cadModelBaseWithUrl.merge(pcbPosition)
expectTypesMatch<CadModelProps, z.input<typeof cadModelObject>>(true)

export const cadmodelProps = z.union([z.null(), z.string(), cadModelObject])

export type CadModelPropsInput = z.input<typeof cadmodelProps>
type InferredCadModelProps = z.infer<typeof cadmodelProps>
expectTypesMatch<InferredCadModelProps, CadModelPropsInput>(true)
