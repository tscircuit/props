import type { ReactElement } from "react"
import { z } from "zod"

export type SymbolProp = string | ReactElement

export const symbolProp = z.custom<SymbolProp>((v) => true)
