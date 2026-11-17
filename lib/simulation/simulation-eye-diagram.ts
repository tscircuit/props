import { signalTimeOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Eye diagram of one channel in a simulation.pcbtransientchannelsimulation. The unit interval is the channel's bit rate; rendering belongs to core. */
export interface SimulationEyeDiagramProps {
  name: string
  /** Name of the simulation.pcbtransientchannelsimulation to read. */
  simulationRef: string
  /** Name of the simulation.pcbdriverreceiverchannel inside that simulation. */
  channelRef: string
  /** Eye window start in seconds or UI. Parsed times are seconds; UI stays a normalized string for core to resolve at the channel bit rate. Omitted: core skips the startup settling. */
  startTime?: string | number
  /** Eye window end in seconds or UI. Omitted: the end of the simulation. */
  endTime?: string | number
}

export const simulationEyeDiagramProps = z
  .object({
    name: z.string().trim().min(1),
    simulationRef: z.string().trim().min(1),
    channelRef: z.string().trim().min(1),
    startTime: signalTimeOrUi.optional(),
    endTime: signalTimeOrUi.optional(),
  })
  .strict()

expectTypesMatch<
  SimulationEyeDiagramProps,
  z.input<typeof simulationEyeDiagramProps>
>(true)
