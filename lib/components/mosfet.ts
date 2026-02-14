import { z } from "zod"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "../common/layout"
import { expectTypesMatch } from "../typecheck"

export interface MosfetProps<PinLabel extends string = string>
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}

export const mosfetProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
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
export type MosfetPinLabels = (typeof mosfetPins)[number]

type InferredMosfetProps = z.input<typeof mosfetProps>
expectTypesMatch<MosfetProps, InferredMosfetProps>(true)
