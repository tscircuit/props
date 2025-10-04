import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface VoltageProbeProps extends CommonComponentProps {
  connectsTo: string | string[]
}

export const voltageProbeProps = commonComponentProps.extend({
  connectsTo: z.string().or(z.array(z.string())),
})

expectTypesMatch<VoltageProbeProps, z.input<typeof voltageProbeProps>>(true)
