import { z } from "zod"

export const commonShapeProps = z.enum(["pill", "rect", "circle"])

export type CommonShape = z.infer<typeof commonShapeProps>
