import { type CadModelProp, cadModelProp } from "lib/common/cadModel"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

export interface AssemblySubassemblyProps {
  /** Stable identity used by selectors from other assembly elements. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
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
  cadModel: cadModelProp.optional(),
  children: z.custom<ReactNode>().optional(),
})

export type AssemblySubassemblyPropsInput = z.input<
  typeof assemblySubassemblyProps
>

expectTypesMatch<AssemblySubassemblyProps, AssemblySubassemblyPropsInput>(true)
