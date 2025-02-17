import { length } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface StampboardProps extends CommonComponentProps {
  width?: string | number
  height?: string | number
  leftPins?: number
  rightPins?: number
  topPins?: number
  bottomPins?: number
  pitch?: string | number
  innerHole?: boolean
}

export const stampboardProps = commonComponentProps.extend({
  width: length.optional(),
  height: length.optional(),
  leftPins: z.number().optional(),
  rightPins: z.number().optional(),
  topPins: z.number().optional(),
  bottomPins: z.number().optional(),
  pitch: length.optional(),
  innerHole: z.boolean().optional(),
})

type InferredStampboardProps = z.input<typeof stampboardProps>
expectTypesMatch<StampboardProps, InferredStampboardProps>(true)
