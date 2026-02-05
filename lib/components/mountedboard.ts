import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

export interface MountedBoardProps extends SubcircuitGroupProps {
  boardToBoardDistance?: Distance
  mountOrientation?: "faceDown" | "faceUp"
}

export const mountedboardProps = subcircuitGroupProps.extend({
  boardToBoardDistance: distance.optional(),
  mountOrientation: z.enum(["faceDown", "faceUp"]).optional(),
})

type InferredMountedBoardProps = z.input<typeof mountedboardProps>
expectTypesMatch<MountedBoardProps, InferredMountedBoardProps>(true)
