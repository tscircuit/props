import { direction } from "lib/common/direction"
import { commonLayoutProps } from "lib/common/layout"
import { kicadPinMetadata } from "lib/common/kicadPinMetadata"
import { z } from "zod"

export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
  connectsTo: z.string().or(z.array(z.string())).optional(),
  kicadPinMetadata: kicadPinMetadata.optional(),
})
export type PortProps = z.input<typeof portProps>
