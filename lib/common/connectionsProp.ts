import { z } from "zod"

export const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

export const createConnectionsProp = <T extends readonly [string, ...string[]]>(
  labels: T,
) => {
  return z.record(z.enum(labels), connectionTarget)
}
