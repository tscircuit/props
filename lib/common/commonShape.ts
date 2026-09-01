import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PillShapeProps {
  shape: "pill"
  width: Distance
  height: Distance
}

export interface RectShapeProps {
  shape: "rect"
  width: Distance
  height: Distance
}

export interface CircleShapeProps {
  shape: "circle"
  radius: Distance
}

export type CommonShapeProps =
  | PillShapeProps
  | RectShapeProps
  | CircleShapeProps

export const pillShapeProps = z.object({
  shape: z.literal("pill"),
  width: distance,
  height: distance,
})

export const rectShapeProps = z.object({
  shape: z.literal("rect"),
  width: distance,
  height: distance,
})

export const circleShapeProps = z.object({
  shape: z.literal("circle"),
  radius: distance,
})

export const commonShapeProps = z.discriminatedUnion("shape", [
  pillShapeProps,
  rectShapeProps,
  circleShapeProps,
])

expectTypesMatch<CommonShapeProps, z.input<typeof commonShapeProps>>(true)
