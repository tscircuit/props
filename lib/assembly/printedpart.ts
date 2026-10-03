import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { url } from "lib/common/url"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { isValidElement, type ReactElement } from "react"
import { z } from "zod"

export interface AssemblyPrintedPartProps {
  /** Stable identity used by assembly mounting selectors. */
  name: string
  displayName?: string
  /** Pure jscad-fiber JSX in right-handed local XYZ, dimensions in millimeters.
   * Named reference rectangles define attachment faces; they add no material.
   * Hooks, async components, and raw kernel geometry are not supported.
   */
  jscad?: ReactElement
  /** Modelprinter/footprinter string or model URL. */
  model?: string
  modelUrl?: string
  cadModel?: CadModelProp
  /** Assembly mounting target. */
  mountedTo?: string
  /** Name of this part's reference rectangle to mate with mountedTo.
   * Both props must be supplied together; outward normals oppose and local
   * in-plane X directions align. Without them the part uses its local origin.
   */
  mountFace?: string
  /** Nonnegative surface clearance in mm or a unit string; defaults to zero.
   * Requires mountedTo. Positive values separate the mating faces.
   */
  mountGap?: Distance
}

export const assemblyPrintedPartProps = z
  .object({
    name: z.string().trim().min(1),
    displayName: z.string().optional(),
    jscad: z
      .custom<ReactElement>(isValidElement, "Expected jscad-fiber JSX")
      .optional(),
    model: z.string().trim().min(1).optional(),
    modelUrl: url
      .refine((value) => value.trim().length > 0, "modelUrl cannot be empty")
      .optional(),
    cadModel: cadModelProp.optional(),
    mountedTo: z
      .string()
      .trim()
      .regex(/^.+\.[^.]+$/, "Expected part.face")
      .optional(),
    mountFace: z.string().trim().min(1).optional(),
    mountGap: distance.pipe(z.number().nonnegative().finite()).optional(),
  })
  .superRefine((part, ctx) => {
    if (
      [part.jscad, part.model, part.modelUrl, part.cadModel].filter(
        (value) => value !== undefined,
      ).length !== 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jscad"],
        message: "Provide exactly one of jscad, model, modelUrl, or cadModel",
      })
    }
    if ((part.mountedTo === undefined) !== (part.mountFace === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mountFace"],
        message: "Provide mountedTo and mountFace together",
      })
    }
    if (part.mountGap !== undefined && part.mountedTo === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mountGap"],
        message: "mountGap requires mountedTo",
      })
    }
  })

export type AssemblyPrintedPartPropsInput = z.input<
  typeof assemblyPrintedPartProps
>
expectTypesMatch<AssemblyPrintedPartProps, AssemblyPrintedPartPropsInput>(true)
