import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { ChipPropsSU } from "./chip"
import { chipProps } from "./chip"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

type MountedBoardChipProps = Pick<
  ChipPropsSU,
  | "manufacturerPartNumber"
  | "pinLabels"
  | "showPinAliases"
  | "pcbPinLabels"
  | "schPortArrangement"
  | "pinCompatibleVariants"
  | "noSchematicRepresentation"
  | "internallyConnectedPins"
  | "externallyConnectedPins"
>

export interface MountedBoardProps
  extends SubcircuitGroupProps,
    MountedBoardChipProps {
  boardToBoardDistance?: Distance
  mountOrientation?: "faceDown" | "faceUp"
}

export const mountedboardProps = subcircuitGroupProps.extend({
  manufacturerPartNumber: chipProps.shape.manufacturerPartNumber,
  pinLabels: chipProps.shape.pinLabels,
  showPinAliases: chipProps.shape.showPinAliases,
  pcbPinLabels: chipProps.shape.pcbPinLabels,
  schPortArrangement: chipProps.shape.schPortArrangement,
  pinCompatibleVariants: chipProps.shape.pinCompatibleVariants,
  noSchematicRepresentation: chipProps.shape.noSchematicRepresentation,
  internallyConnectedPins: chipProps.shape.internallyConnectedPins,
  externallyConnectedPins: chipProps.shape.externallyConnectedPins,
  boardToBoardDistance: distance.optional(),
  mountOrientation: z.enum(["faceDown", "faceUp"]).optional(),
})

type InferredMountedBoardProps = z.input<typeof mountedboardProps>
expectTypesMatch<MountedBoardProps, InferredMountedBoardProps>(true)
