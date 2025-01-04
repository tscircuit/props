import {
  type CommonComponentProps,
  commonComponentProps,
} from "../common/layout"
import { expectTypesMatch } from "../typecheck"
import { z } from "zod"

export interface MosfetProps extends CommonComponentProps {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}

export const mosfetProps = commonComponentProps.extend({
  channelType: z.enum(["n", "p"]),
  mosfetMode: z.enum(["enhancement", "depletion"]),
})

export const mosfetPins = [
  "pin1",
  "drain",
  "pin2",
  "source",
  "pin3",
  "gate",
] as const

type InferredMosfetProps = z.input<typeof mosfetProps>
expectTypesMatch<MosfetProps, InferredMosfetProps>(true)
