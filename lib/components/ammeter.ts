import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const ammeterPinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type AmmeterPinLabels = (typeof ammeterPinLabels)[number]

export interface AmmeterProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections: Connections<AmmeterPinLabels>
  color?: string
  displayLabel?: string
  displayCenter?: number
  displayOffsetDivs?: number
  displayUnitsPerDiv?: number
}

const hasAmmeterConnectionPair = (
  connections: Connections<AmmeterPinLabels>,
) => {
  return (
    (connections.pos !== undefined && connections.neg !== undefined) ||
    (connections.pin1 !== undefined && connections.pin2 !== undefined)
  )
}

export const ammeterProps = commonComponentProps.extend({
  connections: createConnectionsProp(ammeterPinLabels).refine(
    hasAmmeterConnectionPair,
    "Ammeter connections must include either pos/neg or pin1/pin2",
  ),
  color: z.string().optional(),
  displayLabel: z.string().optional(),
  displayCenter: z.number().optional(),
  displayOffsetDivs: z.number().optional(),
  displayUnitsPerDiv: z.number().optional(),
})

export const ammeterPins = ammeterPinLabels

type InferredAmmeterProps = z.input<typeof ammeterProps>
expectTypesMatch<AmmeterProps, InferredAmmeterProps>(true)
