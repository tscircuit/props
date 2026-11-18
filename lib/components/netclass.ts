import { distance } from "circuit-json"
import { z } from "zod"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A named PCB trace-width class, scoped to the containing subcircuit. */
export interface NetClassProps {
  name: string
  /** Explicit net selectors, e.g. ["net.VCC"]. An empty list defines an unused class. */
  nets: string[]
  /** Nominal trace width. Numbers are mm; omitted values inherit the next class/board width. */
  traceWidth?: Distance
  /** Lower values take precedence, then class name. Defaults to zero. */
  priority?: number
}

export const netClassProps = z.object({
  name: z.string().min(1),
  nets: z.array(z.string().regex(/^net\.[^\s>]+$/)),
  traceWidth: distance.pipe(z.number().finite().positive()).optional(),
  priority: z.number().int().nonnegative().optional(),
})

expectTypesMatch<NetClassProps, z.input<typeof netClassProps>>(true)
