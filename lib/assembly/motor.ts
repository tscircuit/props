import {
  type CadModelAxisDirection,
  cadModelAxisDirection,
} from "lib/common/cadModel"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AssemblyMotorProps {
  /** Stable assembly identity used by selectors. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /** Modelprinter string, trimmed; consumers resolve the model internally. */
  model: string
  /**
   * Direction from the motor body toward the shaft tip in the right-handed
   * circuit frame: +X right, +Y top, +Z above the board. This is a direction,
   * not a position; it does not specify translation or rotation about the
   * shaft. Defaults to "z+", the native shaft axis of the NEMA models.
   */
  shaftFacingDirection?: CadModelAxisDirection
}

export const assemblyMotorProps = z.object({
  name: z.string().refine((value) => value.trim().length > 0, {
    message: "name cannot be empty",
  }),
  displayName: z.string().optional(),
  model: z.string().trim().min(1),
  shaftFacingDirection: cadModelAxisDirection.default("z+"),
})

export type AssemblyMotorPropsInput = z.input<typeof assemblyMotorProps>

expectTypesMatch<AssemblyMotorProps, AssemblyMotorPropsInput>(true)
