import {
  type CommonComponentProps,
  commonComponentProps,
} from "../common/layout"
import { expectTypesMatch } from "../typecheck"
import { z } from "zod"

export interface MosfetProps extends CommonComponentProps {
  channelType: "nmos" | "pmos"
}

export const mosfetProps = commonComponentProps.extend({
  channelType: z.enum(["nmos", "pmos"]),
})

type InferredMosfetProps = z.input<typeof mosfetProps>
expectTypesMatch<MosfetProps, InferredMosfetProps>(true)
