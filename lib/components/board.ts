import { z } from "zod"
import { distance } from "@tscircuit/soup"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"

export interface BoardProps {
  width?: number | string
  height?: number | string
  outline?: Point[]
  pcbX?: number | string
  pcbY?: number | string
  layout?: any
  routingDisabled?: boolean
  children?: any
}

export const boardProps = z.object({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  pcbX: distance.optional().default(0),
  pcbY: distance.optional().default(0),
  layout: z.any().optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
})

expectTypesMatch<BoardProps, z.input<typeof boardProps>>(true)
