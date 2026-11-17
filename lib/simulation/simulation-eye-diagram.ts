import { signalTimeOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Eye diagram of every driven channel in a simulation.pcbtransientchannelsimulation. Quiet channels (driverDisabled or a constant pattern) have no eye and are skipped. Each eye uses its channel's bit rate as the unit interval; rendering belongs to core. */
export interface SimulationEyeDiagramProps {
  name: string
  /** Name of the simulation.pcbtransientchannelsimulation to read. */
  simulationRef: string
  /** Eye window start in seconds or UI. Parsed times are seconds; UI stays a normalized string for core to resolve at each channel's bit rate. Omitted: core skips the startup settling. */
  startTime?: string | number
  /** Eye window end in seconds or UI. Omitted: the end of the simulation. */
  endTime?: string | number
}

export const simulationEyeDiagramProps = z
  .object({
    name: z.string().trim().min(1),
    simulationRef: z.string().trim().min(1),
    startTime: signalTimeOrUi.optional(),
    endTime: signalTimeOrUi.optional(),
  })
  .strict()

expectTypesMatch<
  SimulationEyeDiagramProps,
  z.input<typeof simulationEyeDiagramProps>
>(true)
