import { layer_ref, type LayerRef, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { BusName } from "../components/bus"
import {
  type FanoutBoundaryPadding,
  fanoutBoundaryPadding,
} from "./fanoutBoundaryPadding"
import { type NinePointAnchor, ninePointAnchor } from "./ninePointAnchor"

export type BusFanoutDirection =
  | NinePointAnchor
  | {
      direction: NinePointAnchor
    }

export type FanoutPourNetMap = Partial<
  Record<Extract<LayerRef, string>, string | string[]>
>

/**
 * Routing controls shared by fanout autorouting phases and breakout groups.
 */
export interface FanoutProps {
  /**
   * Fanout direction for each named bus. `center` leaves the direction
   * unconstrained.
   */
  busFanoutDirections?: Record<BusName, BusFanoutDirection>
  /**
   * Padding between the union of the fanout source pads and the shared
   * boundary where fanout traces terminate.
   */
  fanoutBoundaryPadding?: FanoutBoundaryPadding
  /**
   * Copper layers available to boundary-terminated fanout buses. Source-only
   * traces whose nets are mapped by `fanoutPourNetMap` terminate on their
   * mapped plane layer.
   */
  fanoutRoutingLayers?: LayerRefInput[]
  /**
   * Maps copper layers to the net or nets poured on them. During fanout,
   * source-only traces on those nets drop to the mapped layer instead of
   * routing to the breakout boundary.
   *
   * This is inferred from `<copperpour>` components when omitted.
   */
  fanoutPourNetMap?: FanoutPourNetMap
}

export const busFanoutDirection = z.union([
  ninePointAnchor,
  z.object({ direction: ninePointAnchor }),
])

export const fanoutProps = z.object({
  busFanoutDirections: z.record(busFanoutDirection).optional(),
  fanoutBoundaryPadding: fanoutBoundaryPadding.optional(),
  fanoutRoutingLayers: z.array(layer_ref).min(1).optional(),
  fanoutPourNetMap: z
    .record(layer_ref, z.union([z.string(), z.array(z.string()).min(1)]))
    .optional(),
})

expectTypesMatch<FanoutProps, z.input<typeof fanoutProps>>(true)
