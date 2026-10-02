import {
  type CadModelAxisDirection,
  cadModelAxisDirection,
} from "lib/common/cadModel"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type AssemblyMotorStandard = "nema8" | "nema17" | "nema23"

export interface AssemblyMotorProps {
  /** Stable assembly identity used by selectors. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /** NEMA frame standard; required when model is omitted, exclusive with model. */
  standard?: AssemblyMotorStandard
  /** Advanced modelprinter string, trimmed; exclusive with standard. */
  model?: string
  /**
   * Direction from the motor body toward the shaft tip in the right-handed
   * circuit frame: +X right, +Y top, +Z above the board. This is a direction,
   * not a position; it does not specify translation or rotation about the
   * shaft. Defaults to "z+", the native shaft axis of the NEMA models.
   */
  shaftFacingDirection?: CadModelAxisDirection
}

export const assemblyMotorProps = z
  .object({
    name: z.string().refine((value) => value.trim().length > 0, {
      message: "name cannot be empty",
    }),
    displayName: z.string().optional(),
    standard: z.enum(["nema8", "nema17", "nema23"]).optional(),
    model: z.string().trim().min(1).optional(),
    shaftFacingDirection: cadModelAxisDirection.default("z+"),
  })
  .superRefine((motor, context) => {
    if (motor.standard === undefined && motor.model === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide standard or model",
        path: ["standard"],
      })
    }
    if (motor.standard !== undefined && motor.model !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either standard or model, not both",
        path: ["model"],
      })
    }
  })

export type AssemblyMotorPropsInput = z.input<typeof assemblyMotorProps>

expectTypesMatch<AssemblyMotorProps, AssemblyMotorPropsInput>(true)
