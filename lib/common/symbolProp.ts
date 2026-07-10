import type { AnyCircuitElement } from "circuit-json"
import type { ReactElement } from "react"
import { z } from "zod"

export type SymbolProp = string | ReactElement | AnyCircuitElement[]

export const symbolProp = z.custom<SymbolProp>((v) => true)
