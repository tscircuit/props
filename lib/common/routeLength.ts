import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** A length measured from the selected signals' pad endpoints, in board-world
 * XY mm (+X right, +Y up). of accepts trace/port/bus/pair selectors. Without
 * of, use the current members and any lengthMatchTo members. */
export interface RelativeRouteLength {
  reference: "longest_manhattan"
  of?: string[]
  /** Offset added to the reference distance. Raw numbers are mm; may be negative. */
  offset?: number | string
}
export type RouteLength = number | string | RelativeRouteLength
export const nonnegativeRouteDistance = distance.pipe(
  z.number().nonnegative().finite(),
)
export const routeLength = z.union([
  nonnegativeRouteDistance,
  z
    .object({
      reference: z.literal("longest_manhattan"),
      of: z.array(z.string().min(1)).min(1).optional(),
      offset: distance.pipe(z.number().finite()).optional(),
    })
    .strict(),
])
expectTypesMatch<RouteLength, z.input<typeof routeLength>>(true)

/** Validate comparable bounds without resolving selectors or geometry here.
 * Relative values with different references remain independent constraints. */
export function validateRouteLengths(
  props: {
    minLength?: z.output<typeof routeLength>
    maxLength?: z.output<typeof routeLength>
    targetLength?: z.output<typeof routeLength>
    lengthTolerance?: number
    lengthMatchTo?: string | string[]
    maxLengthSkew?: number
  },
  ctx: z.RefinementCtx,
) {
  if (
    Boolean(props.targetLength !== undefined) !==
    Boolean(props.lengthTolerance !== undefined)
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["lengthTolerance"],
      message: "targetLength and lengthTolerance must be supplied together",
    })
  if (props.lengthMatchTo !== undefined && props.maxLengthSkew === undefined)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxLengthSkew"],
      message: "lengthMatchTo requires an explicit maxLengthSkew",
    })
  const comparable = (value: z.output<typeof routeLength>) =>
    typeof value === "number"
      ? { basis: "absolute", amount: value }
      : {
          basis: JSON.stringify([
            value.reference,
            value.of ? [...value.of].sort() : null,
          ]),
          amount: value.offset ?? 0,
        }
  const min =
    props.minLength === undefined ? undefined : comparable(props.minLength)
  const max =
    props.maxLength === undefined ? undefined : comparable(props.maxLength)
  const target =
    props.targetLength === undefined
      ? undefined
      : comparable(props.targetLength)
  if (min && max && min.basis === max.basis && min.amount > max.amount)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxLength"],
      message: "maxLength cannot be below minLength for the same reference",
    })
  if (
    (target &&
      min &&
      target.basis === min.basis &&
      target.amount + (props.lengthTolerance ?? 0) < min.amount) ||
    (target &&
      max &&
      target.basis === max.basis &&
      target.amount - (props.lengthTolerance ?? 0) > max.amount)
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["targetLength"],
      message:
        "targetLength tolerance window does not intersect the declared length bounds",
    })
}
export const lengthMatchTo = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
])
