import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { isValidElement, type ReactElement, type ReactNode } from "react"
import { z } from "zod"
import {
  assemblyFaceMountShape,
  refineAssemblyFaceMount,
  type AssemblyFaceMountProps,
} from "./face-mounting"

/** Provide exactly one of jscad, model, modelUrl, or cadModel. */
export interface AssemblyPrintedPartProps extends AssemblyFaceMountProps {
  /** Stable identity used by assembly mounting selectors. */
  name: string
  displayName?: string
  /** Color for the rendered printed part. Omit to retain authored materials. */
  color?: string
  /** Printable material classification; omitted when unspecified. */
  material?: "pla" | "petg" | "nylon"
  /** Reference surfaces defining named mounting frames, alongside CAD children. */
  children?: ReactNode
  /** Pure jscad-fiber JSX in right-handed local XYZ, dimensions in millimeters.
   * Named reference rectangles define attachment faces; they add no material.
   * Hooks, async components, and raw kernel geometry are not supported.
   */
  jscad?: ReactElement
  /** Modelprinter/footprinter string or model URL. */
  model?: string
  modelUrl?: string
  cadModel?: CadModelProp
}

export const assemblyPrintedPartProps = z
  .object({
    ...assemblyFaceMountShape,
    name: z.string().trim().min(1),
    displayName: z.string().optional(),
    color: z.string().trim().min(1).optional(),
    material: z.enum(["pla", "petg", "nylon"]).optional(),
    children: z.custom<ReactNode>().optional(),
    jscad: z
      .custom<ReactElement>(isValidElement, "Expected jscad-fiber JSX")
      .optional(),
    model: z.string().trim().min(1).optional(),
    modelUrl: url
      .refine((value) => value.trim().length > 0, "modelUrl cannot be empty")
      .optional(),
    cadModel: cadModelProp.optional(),
  })
  .superRefine((part, ctx) => {
    refineAssemblyFaceMount(part, ctx)
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
  })

export type AssemblyPrintedPartPropsInput = z.input<
  typeof assemblyPrintedPartProps
>
expectTypesMatch<AssemblyPrintedPartProps, AssemblyPrintedPartPropsInput>(true)
