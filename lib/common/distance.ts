import { distance as baseDistance, length } from "circuit-json"
import { z } from "zod"

export type Distance = number | string

const calcString = z.string().regex(/^calc\(.*\)$/)

export const distance = baseDistance
export const pcbCoordinate = calcString.or(baseDistance)

export { length }
