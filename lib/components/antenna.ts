import { type Distance, distance } from "lib/common/distance"
import { type PcbPath, pcbPath } from "lib/common/pcbPath"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Props for a PCB antenna defined by an explicit copper path. */
export interface AntennaProps {
  key?: string
  name?: string
  displayName?: string
  thickness?: Distance
  /** Alias for antenna trace thickness. */
  width?: Distance
  pcbPathRelativeTo?: string
  /**
   * Explicit antenna path. Entries use the same selector, point, and via
   * syntax as trace pcbPath entries.
   */
  pcbPath?: PcbPath
}

export const antennaProps = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  displayName: z.string().optional(),
  thickness: distance.optional(),
  width: distance.optional().describe("Alias for antenna trace thickness"),
  pcbPathRelativeTo: z.string().optional(),
  pcbPath: pcbPath.optional(),
})

type InferredAntennaProps = z.input<typeof antennaProps>
expectTypesMatch<AntennaProps, InferredAntennaProps>(true)
