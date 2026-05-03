import { expectTypesMatch } from "lib/typecheck"
import { autorouterProp, type AutorouterProp } from "./group"
import { z } from "zod"

export interface AutoroutingPhaseProps {
  phaseIndex: number
  autorouter: AutorouterProp
}

export const autoroutingPhaseProps = z.object({
  phaseIndex: z.number(),
  autorouter: autorouterProp,
})

expectTypesMatch<AutoroutingPhaseProps, z.input<typeof autoroutingPhaseProps>>(
  true,
)
