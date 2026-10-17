import type { AnyCircuitElement, PcbComponent, PcbPort } from "circuit-json"
import type { ReactNode } from "react"
import { z } from "zod"

/** Every PCB circuit-json element: pads, holes, traces, vias, silkscreen, keepouts, notes, errors... */
export type PcbCircuitElement = Extract<
  AnyCircuitElement,
  { type: `pcb_${string}` }
>

export type PcbCircuitElementType = PcbCircuitElement["type"]

/**
 * An element to insert. Its id (`<type>_id`) is generated and `subcircuit_id`
 * defaults to the step's subcircuit; everything else is validated against the
 * circuit-json schema for the type.
 */
export type PcbPostRoutingElementInput<
  T extends PcbCircuitElementType = PcbCircuitElementType,
> = { type: T } & Partial<Extract<PcbCircuitElement, { type: T }>>

/**
 * What a `<pcbpostroutingstep />` receives. Steps run after autorouting and
 * teardrops, before copper pours, via stitching and PCB design rule checks, so
 * whatever they change is poured around, checked and exported.
 *
 * Every change a step makes is recorded. Before the steps run again (after
 * re-routing), the recorded changes are undone, so each run starts from the
 * routed board.
 */
export interface PcbPostRoutingContext {
  /** subcircuit_id of the board or subcircuit group running the step. */
  readonly subcircuitId: string | undefined
  /**
   * The circuit as it is now, including earlier steps' changes. Returns a copy;
   * edit through insert/update/remove, or return elements from `render`.
   */
  getCircuitJson(): AnyCircuitElement[]
  /**
   * The pcb_port for a selector relative to the board or subcircuit, e.g.
   * ".U1 > .pin1". Use its pcb_port_id and pcb_component_id to attach copper
   * to a port's component and net.
   */
  getPcbPort(selector: string): PcbPort | undefined
  /** The pcb_component for a selector relative to the board or subcircuit, e.g. ".U1". */
  getPcbComponent(selector: string): PcbComponent | undefined
  /** Inserts a PCB element and returns it with its generated id. */
  insert<T extends PcbCircuitElementType>(
    element: PcbPostRoutingElementInput<T>,
  ): Extract<PcbCircuitElement, { type: T }>
  /**
   * Changes fields of a PCB element by id (any `pcb_*` element, including those
   * created by routing or by footprints). The type and id cannot change.
   */
  update(id: string, patch: Record<string, unknown>): PcbCircuitElement
  /** Removes a PCB element by id. */
  remove(id: string): void
}

/**
 * Edits the routed PCB through the context. May be async. Should be
 * deterministic: it runs again whenever routing is redone, starting from the
 * routed board each time.
 */
export type PcbPostRoutingFn = (
  context: PcbPostRoutingContext,
) => void | Promise<void>

/**
 * Returns PCB primitives as JSX (`<smtpad />`, `<platedhole />`, `<hole />`,
 * `<silkscreenpath />`, `<pcbnotetext />`...). They are added beside the step,
 * so inside a component's footprint they belong to that component and
 * `portHints` attach them to its ports. Coordinates are relative to the parent,
 * as for any footprint primitive. May be async.
 */
export type PcbPostRoutingRenderFn = (
  context: PcbPostRoutingContext,
) => ReactNode | Promise<ReactNode>

export const pcbPostRoutingFn = z.custom<PcbPostRoutingFn>(
  (value) => typeof value === "function",
  { message: "fn must be a function" },
)

export const pcbPostRoutingRenderFn = z.custom<PcbPostRoutingRenderFn>(
  (value) => typeof value === "function",
  { message: "render must be a function" },
)
