import { url } from "lib/common/url"
import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"
import {
  assemblyCableConnectorProps,
  type AssemblyCableConnectorProps,
} from "./cable-connector"

export interface AssemblySubassemblyProps {
  /** Stable identity used by selectors from other assembly elements. */
  name: string
  /** Imported CAD model URL. Mutually exclusive with cadModel where supported. */
  modelUrl?: string
  /** Modelprinter/footprinter string, trimmed; mutually exclusive with other model sources. */
  model?: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /** Optional CAD geometry using the existing component cadModel formats. */
  cadModel?: CadModelProp
  /** Nested assembly elements or CAD geometry; preserved without parsing. */
  children?: ReactNode
  /** Named physical cable interfaces on the imported CAD model. Connect using
   * `from="MOTOR.phases"`; coordinates follow the CAD model's offset/rotation.
   */
  cableConnectors?: Record<string, AssemblyCableConnectorProps>
}

export const assemblySubassemblyProps = z
  .object({
    name: z.string().refine((value) => value.trim().length > 0, {
      message: "name cannot be empty",
    }),
    displayName: z.string().optional(),
    model: z.string().trim().min(1).optional(),
    modelUrl: url
      .refine((value) => value.trim().length > 0, {
        message: "modelUrl cannot be empty",
      })
      .optional(),
    cadModel: cadModelProp.optional(),
    children: z.custom<ReactNode>().optional(),
    cableConnectors: z
      .record(
        z
          .string()
          .regex(
            /^[A-Za-z][A-Za-z0-9_]*$/,
            "Connector names must be simple identifiers",
          ),
        assemblyCableConnectorProps,
      )
      .optional(),
  })
  .refine(
    (assembly) =>
      assembly.modelUrl === undefined || assembly.cadModel === undefined,
    {
      message: "Provide either modelUrl or cadModel, not both",
      path: ["modelUrl"],
    },
  )
  .refine(
    (assembly) =>
      assembly.model === undefined ||
      (assembly.modelUrl === undefined && assembly.cadModel === undefined),
    {
      message: "Provide only one of model, modelUrl, or cadModel",
      path: ["model"],
    },
  )

export type AssemblySubassemblyPropsInput = z.input<
  typeof assemblySubassemblyProps
>

expectTypesMatch<AssemblySubassemblyProps, AssemblySubassemblyPropsInput>(true)
