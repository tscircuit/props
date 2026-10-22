import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A paper-space drawing page containing configured part views. */
export interface AssemblyDrawingPageProps {
  name?: string
  displayName?: string
  /** Paper dimensions in mm when numeric; unit strings are accepted. */
  width: Distance
  height: Distance
  children?: any
}

export const assemblyDrawingPageProps = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  width: distance.pipe(z.number().finite().positive()),
  height: distance.pipe(z.number().finite().positive()),
  children: z.any().optional(),
})

export type InferredAssemblyDrawingPageProps = z.input<
  typeof assemblyDrawingPageProps
>
expectTypesMatch<
  AssemblyDrawingPageProps,
  z.input<typeof assemblyDrawingPageProps>
>(true)
