import {
  type PcbPostRoutingFn,
  type PcbPostRoutingRenderFn,
  pcbPostRoutingFn,
  pcbPostRoutingRenderFn,
} from "lib/common/pcbPostRouting"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/**
 * User code that changes the PCB after its board or subcircuit is routed, before
 * copper pours, via stitching and PCB design rule checks. A board may hold any
 * number of steps, anywhere in its tree, including inside components.
 */
export interface PcbPostRoutingStepProps {
  name?: string
  /**
   * Steps of a board or subcircuit run in ascending order. Steps with the same
   * order run in the order they appear. Defaults to 0.
   */
  order?: number
  /** Edits the routed PCB as circuit-json: insert, update or remove any pcb_* element. */
  fn?: PcbPostRoutingFn
  /** Returns PCB primitives as JSX, added beside the step. */
  render?: PcbPostRoutingRenderFn
}

export const pcbPostRoutingStepProps = z
  .object({
    name: z.string().optional(),
    order: z.number().optional(),
    fn: pcbPostRoutingFn.optional(),
    render: pcbPostRoutingRenderFn.optional(),
  })
  .refine((props) => props.fn !== undefined || props.render !== undefined, {
    message: "<pcbpostroutingstep /> needs fn or render",
  })

type InferredPcbPostRoutingStepProps = z.input<typeof pcbPostRoutingStepProps>
expectTypesMatch<PcbPostRoutingStepProps, InferredPcbPostRoutingStepProps>(true)
