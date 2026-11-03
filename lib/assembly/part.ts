import { assemblyBomProps, type AssemblyBomProps } from "./bom"
import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { ReactNode } from "react"
import {
  assemblyFaceMountShape,
  refineAssemblyFaceMount,
  type AssemblyFaceMountProps,
} from "./face-mounting"

/** A generic component of an assembly, with optional CAD geometry. */
export interface AssemblyPartProps
  extends AssemblyFaceMountProps,
    AssemblyBomProps {
  /** Stable identity used by assembly selectors. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /** Modelprinter/footprinter string, trimmed; mutually exclusive with modelUrl and cadModel. */
  model?: string
  /** Imported CAD model URL; mutually exclusive with model and cadModel. */
  modelUrl?: string
  /** Existing component CAD model formats; mutually exclusive with model and modelUrl. */
  cadModel?: CadModelProp
  /** Reference surfaces defining named mounting frames for this part. */
  children?: ReactNode
}

// Internal base for elements with their own mounting semantics, e.g. fasteners.
// Keep model validation separate from ordinary face-mount pairing.
export const assemblyPartBaseProps = z
  .object({
    ...assemblyBomProps.shape,
    name: z.string().trim().min(1),
    displayName: z.string().optional(),
    model: z.string().trim().min(1).optional(),
    modelUrl: url
      .refine((value) => value.trim().length > 0, "modelUrl cannot be empty")
      .optional(),
    cadModel: cadModelProp.optional(),
    children: z.custom<ReactNode>().optional(),
  })
  .refine(
    (part) =>
      [part.model, part.modelUrl, part.cadModel].filter(
        (value) => value !== undefined,
      ).length <= 1,
    {
      message: "Provide only one of model, modelUrl, or cadModel",
      path: ["model"],
    },
  )

export const assemblyPartProps = assemblyPartBaseProps
  .and(z.object(assemblyFaceMountShape))
  .superRefine(refineAssemblyFaceMount)

export type AssemblyPartPropsInput = {
  [K in keyof z.input<typeof assemblyPartProps>]: z.input<
    typeof assemblyPartProps
  >[K]
}

expectTypesMatch<AssemblyPartProps, AssemblyPartPropsInput>(true)
