import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

export interface AssemblySubassemblyProps {
  /** Stable identity used by selectors from other assembly elements. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /**
   * Attachment target selector, resolved within the nearest assembly.device.
   * May select a connector, assembly.screen, assembly.subassembly, or its
   * assembly.cadassembly alias. Omit for an independently placed assembly.
   * This establishes attachment, not a copy of the target's geometry.
   * Target existence, ambiguity, and attachment cycles are checked by core.
   */
  connectsTo?: string
  /** Optional CAD geometry using the existing component cadModel formats. */
  cadModel?: CadModelProp
  /** Nested assembly elements or CAD geometry; preserved without parsing. */
  children?: ReactNode
}

export const assemblySubassemblyProps = z.object({
  name: z.string().refine((value) => value.trim().length > 0, {
    message: "name cannot be empty",
  }),
  displayName: z.string().optional(),
  connectsTo: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "connectsTo cannot be empty",
    })
    .optional(),
  cadModel: cadModelProp.optional(),
  children: z.custom<ReactNode>().optional(),
})

export type AssemblySubassemblyPropsInput = z.input<
  typeof assemblySubassemblyProps
>

expectTypesMatch<AssemblySubassemblyProps, AssemblySubassemblyPropsInput>(true)
