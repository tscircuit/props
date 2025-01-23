import { voltage } from "circuit-json"
import { commonComponentProps } from "lib/common/layout"
import type { z } from "zod"

export const powerSourceProps = commonComponentProps.extend({
  voltage,
})
export type PowerSourceProps = z.input<typeof powerSourceProps>
