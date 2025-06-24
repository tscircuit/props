import { jumperProps, type JumperProps } from "./jumper"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SolderJumperProps extends JumperProps {
  /**
   * Pins that are bridged with solder by default
   */
  bridgedPins?: string[][]
  /**
   * If true, all pins are connected with cuttable traces
   */
  bridged?: boolean
}

export const solderjumperProps = jumperProps.extend({
  bridgedPins: z.array(z.array(z.string())).optional(),
  bridged: z.boolean().optional(),
})

type InferredSolderJumperProps = z.input<typeof solderjumperProps>
expectTypesMatch<SolderJumperProps, InferredSolderJumperProps>(true)
