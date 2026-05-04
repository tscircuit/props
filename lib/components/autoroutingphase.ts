import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { autorouterProp, type AutorouterProp } from "./group"

export interface AutoroutingPhaseProps {
  name?: string
  key?: any
  children?: any
  autorouter?: AutorouterProp
  phaseIndex?: number
}

export const autoroutingPhaseProps = z.object({
  name: z.string().optional(),
  key: z.any().optional(),
  children: z.any().optional(),
  autorouter: autorouterProp.optional(),
  phaseIndex: z.number().optional(),
})

type InferredAutoroutingPhaseProps = z.input<typeof autoroutingPhaseProps>
expectTypesMatch<AutoroutingPhaseProps, InferredAutoroutingPhaseProps>(true)
