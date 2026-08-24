import { type LayerRef, type LayerRefInput, layer_ref } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { BusName } from "../components/bus"
import {
  type FanoutBoundaryPadding,
  fanoutBoundaryPadding,
} from "./fanoutBoundaryPadding"
import { type NinePointAnchor, ninePointAnchor } from "./ninePointAnchor"

/**
 * An unambiguous fanout direction and boundary position.
 *
 * The prefix before `side` names the physical boundary edge. The suffix names
 * the region along that edge; for corner regions it also names the local
 * direction used to escape the source pads. For example, `rightside_top`
 * terminates on the right edge in its upper region after escaping the source
 * pads toward the top, while `topside_right` terminates on the top edge in its
 * right region after escaping toward the right. Center regions escape toward
 * their named edge. Directions are in board/circuit world coordinates, where
 * right is +X and top is +Y; they do not rotate with the source component.
 * `center` leaves the fanout direction unconstrained.
 */
export const canonicalBusFanoutDirectionValues = [
  "topside_left",
  "topside_center",
  "topside_right",
  "rightside_top",
  "rightside_center",
  "rightside_bottom",
  "bottomside_right",
  "bottomside_center",
  "bottomside_left",
  "leftside_bottom",
  "leftside_center",
  "leftside_top",
  "center",
] as const

export const canonicalBusFanoutDirection = z.enum(
  canonicalBusFanoutDirectionValues,
)

export type CanonicalBusFanoutDirection =
  (typeof canonicalBusFanoutDirectionValues)[number]

/**
 * Legacy nine-point fanout names. They remain accepted for compatibility;
 * prefer `CanonicalBusFanoutDirection` when the physical exit edge matters.
 */
export type LegacyBusFanoutDirection = NinePointAnchor

export type BusFanoutDirectionLiteral =
  | NinePointAnchor
  | CanonicalBusFanoutDirection

export type BusFanoutDirection =
  | BusFanoutDirectionLiteral
  | {
      direction: BusFanoutDirectionLiteral
    }

export type FanoutPourNetMap = Partial<
  Record<Extract<LayerRef, string>, string | string[]>
>

/**
 * Routing controls shared by fanout autorouting phases and breakout groups.
 */
export interface FanoutProps {
  /**
   * Fanout direction and boundary position for each named bus. Prefer the
   * edge-first names such as `rightside_top` and `topside_right` when selecting
   * a corner region; their physical exit edges are unambiguous. Legacy
   * nine-point names remain accepted. `center` leaves the direction
   * unconstrained. Directions use board/circuit world coordinates. For a bus
   * that terminates on a copper plane, the physical-edge prefix is ignored and
   * only the position's local escape direction is used.
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
  canonicalBusFanoutDirection,
  z.object({
    direction: z.union([ninePointAnchor, canonicalBusFanoutDirection]),
  }),
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
