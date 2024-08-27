import { z } from "zod"
import { commonLayoutProps } from "../types/common"
import { voltage } from "@tscircuit/soup"

export const powerSourceProps = commonLayoutProps.extend({
  voltage,
})
export type PowerSourceProps = z.input<typeof powerSourceProps>
