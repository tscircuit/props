import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { type PcbPath, pcbPath } from "lib/common/pcbPath"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Props for an antenna component with an optional explicit PCB path. */
export interface AntennaProps extends CommonComponentProps {
  /**
   * Explicit antenna path. Entries use the same selector, point, and via
   * syntax as trace pcbPath entries.
   */
  pcbPath?: PcbPath
}

export const antennaProps = commonComponentProps.extend({
  pcbPath: pcbPath.optional(),
})

type InferredAntennaProps = z.input<typeof antennaProps>
expectTypesMatch<AntennaProps, InferredAntennaProps>(true)
