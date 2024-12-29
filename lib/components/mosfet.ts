import {
  type CommonComponentProps,
  commonComponentProps,
} from "../common/layout"
import { expectTypesMatch } from "../typecheck"
import { z } from "zod"

export interface MosfetProps extends CommonComponentProps {
  mosfetType: "n_channel_moset" | "p_channel_moset"
  schRotation?: number
}

export const mosfetProps = commonComponentProps.extend({
  mosfetType: z.enum(["n_channel_moset", "p_channel_moset"]),
  schRotation: z.number().optional(),
})

type InferredMosfetProps = z.input<typeof mosfetProps>
expectTypesMatch<MosfetProps, InferredMosfetProps>(true)
