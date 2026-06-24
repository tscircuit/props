import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface VoltageProbeProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  connectsTo: string
  referenceTo?: string
  color?: string
  displayLabel?: string
  displayCenter?: number
  displayOffsetDivs?: number
  displayUnitsPerDiv?: number
}

export const voltageProbeProps = commonComponentProps
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
    connectsTo: z.string(),
    referenceTo: z.string().optional(),
    color: z.string().optional(),
    displayLabel: z.string().optional(),
    displayCenter: z.number().optional(),
    displayOffsetDivs: z.number().optional(),
    displayUnitsPerDiv: z.number().optional(),
  })

expectTypesMatch<VoltageProbeProps, z.input<typeof voltageProbeProps>>(true)
