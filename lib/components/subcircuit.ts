import type { SubcircuitGroupProps } from "./group"
import { subcircuitGroupProps } from "./group"
import type { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export type SubcircuitProps = SubcircuitGroupProps

export const subcircuitProps = subcircuitGroupProps.omit({ subcircuit: true })

type InferredSubcircuitProps = z.input<typeof subcircuitProps>
expectTypesMatch<SubcircuitProps, InferredSubcircuitProps>(true)
