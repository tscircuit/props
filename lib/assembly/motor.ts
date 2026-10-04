import {
  type CadModelAxisDirection,
  cadModelAxisDirection,
} from "lib/common/cadModel"
import { distance, type Distance } from "lib/common/distance"
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
  /** e.g. "jst-ph-6". */
  wireConnection?: "none" | "stubs" | "jst-ph-6"
  /** Assembly mounting target, e.g. "FRAME.xMotor"; paired with mountFace.
   * Face mating determines orientation, so shaftFacingDirection must be omitted.
   */
  mountedTo?: string
  /** This motor's mating face, e.g. "frontface" or "backface".
   * Outward normals oppose and in-plane X directions align with the target.
   */
  mountFace?: string
  /** Nonnegative surface clearance in mm or a unit string; defaults to zero.
   * Requires mountedTo. Positive values separate the mating faces.
   */
  mountGap?: Distance
}

export const assemblyMotorProps = z
  .object({
    name: z.string().refine((value) => value.trim().length > 0, {
      message: "name cannot be empty",
    }),
    displayName: z.string().optional(),
    standard: z.enum(["nema8", "nema17", "nema23"]).optional(),
    model: z.string().trim().min(1).optional(),
    shaftFacingDirection: cadModelAxisDirection.optional(),
    wireConnection: z.enum(["none", "stubs", "jst-ph-6"]).optional(),
    mountedTo: z
      .string()
      .trim()
      .regex(/^.+\.[^.]+$/, "Expected part.face")
      .optional(),
    mountFace: z.string().trim().min(1).optional(),
    mountGap: distance.pipe(z.number().nonnegative().finite()).optional(),
  })
  .superRefine((motor, context) => {
    if ((motor.mountedTo === undefined) !== (motor.mountFace === undefined)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide mountedTo and mountFace together",
        path: ["mountFace"],
      })
    }
    if (motor.mountGap !== undefined && motor.mountedTo === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "mountGap requires mountedTo",
        path: ["mountGap"],
      })
    }
    if (
      motor.mountedTo !== undefined &&
      motor.shaftFacingDirection !== undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mounted motors derive shaft direction from the mating faces",
        path: ["shaftFacingDirection"],
      })
    }
    if (motor.model !== undefined && motor.wireConnection !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Set wireConnection in the custom model string, or use standard",
        path: ["wireConnection"],
      })
    }
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
  .transform((motor) =>
    motor.mountedTo === undefined
      ? {
          ...motor,
          shaftFacingDirection: motor.shaftFacingDirection ?? ("z+" as const),
        }
      : motor,
  )

export type AssemblyMotorPropsInput = z.input<typeof assemblyMotorProps>

expectTypesMatch<AssemblyMotorProps, AssemblyMotorPropsInput>(true)
