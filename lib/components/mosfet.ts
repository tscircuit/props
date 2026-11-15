import {
  type CommonComponentProps,
  commonComponentProps,
} from "../common/layout"
import { createConnectionsProp } from "../common/connectionsProp"
import { expectTypesMatch } from "../typecheck"
import type { Connections } from "../utility-types/connections-and-selectors"
import { pinLabelsProp, type PinLabelsProp } from "./chip"
import { z } from "zod"

export const mosfetPins = [
  "pin1",
  "drain",
  "pin2",
  "source",
  "pin3",
  "gate",
] as const
export type MosfetPinLabels = (typeof mosfetPins)[number]

export interface MosfetProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
  /**
   * Physical package pins mapped to semantic terminal names (and optional aliases).
   * For AO3400A / BSS138 SOT-23: { pin1: "gate", pin2: "source", pin3: "drain" }.
   * Use full terminal names to retain schematic and simulation semantics.
   * Omit to retain the symbol's default pin order; no package pinout is inferred.
   */
  pinLabels?: PinLabelsProp<string, PinLabel>
  /** The side of the schematic symbol where the drain port is placed. */
  symbolDrainSide?: "left" | "right" | "top" | "bottom"
  /** The side of the schematic symbol where the source port is placed. */
  symbolSourceSide?: "left" | "right" | "top" | "bottom"
  /** The side of the schematic symbol where the gate port is placed. */
  symbolGateSide?: "left" | "right" | "top" | "bottom"
  connections?: Connections<MosfetPinLabels>
}

export const mosfetProps = commonComponentProps.extend({
  channelType: z.enum(["n", "p"]),
  mosfetMode: z.enum(["enhancement", "depletion"]),
  pinLabels: pinLabelsProp.optional(),
  symbolDrainSide: z.enum(["left", "right", "top", "bottom"]).optional(),
  symbolSourceSide: z.enum(["left", "right", "top", "bottom"]).optional(),
  symbolGateSide: z.enum(["left", "right", "top", "bottom"]).optional(),
  connections: createConnectionsProp(mosfetPins).optional(),
})

type InferredMosfetProps = z.input<typeof mosfetProps>
expectTypesMatch<MosfetProps, InferredMosfetProps>(true)
