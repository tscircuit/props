import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export const schematicRowProps = z.object({
  children: z.any().optional(),
  height: distance.optional(),
})

export interface SchematicRowProps {
  children?: any
  height?: number | string
}

expectTypesMatch<SchematicRowProps, z.input<typeof schematicRowProps>>(true)
