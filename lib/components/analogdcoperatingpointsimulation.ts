import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  analogAnalysisSimulationBaseProps,
  type AnalogAnalysisSimulationBaseProps,
} from "./analogsimulation"

export type AnalogDcOperatingPointSimulationProps =
  AnalogAnalysisSimulationBaseProps

export const analogDcOperatingPointSimulationProps = z.object({
  ...analogAnalysisSimulationBaseProps,
})

expectTypesMatch<
  AnalogDcOperatingPointSimulationProps,
  z.input<typeof analogDcOperatingPointSimulationProps>
>(true)
