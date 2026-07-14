import { z } from "zod"

export const pillShapeProps = z.object({ shape: z.literal("pill") })
export const rectShapeProps = z.object({ shape: z.literal("rect") })
export const circleShapeProps = z.object({ shape: z.literal("circle") })

export const commonShapeProps = z.discriminatedUnion("shape", [
  pillShapeProps,
  rectShapeProps,
  circleShapeProps,
])

export interface CommonShapeProps {
  shape: "pill" | "rect" | "circle"
}
