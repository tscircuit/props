import type { AnyCircuitElement, PcbComponent, PcbPort } from "circuit-json"

/** Every PCB circuit-json element: pads, holes, traces, vias, silkscreen, keepouts, notes, errors... */
export type PcbCircuitElement = Extract<
  AnyCircuitElement,
  { type: `pcb_${string}` }
>

export type PcbCircuitElementType = PcbCircuitElement["type"]

/**
 * An element to insert. Its id (`<type>_id`) is generated and `subcircuit_id`
 * defaults to the hook's subcircuit; everything else is validated against the
 * circuit-json schema for the type.
 */
export type PcbPostRoutingHookElementInput<
  T extends PcbCircuitElementType = PcbCircuitElementType,
> = { type: T } & Partial<Extract<PcbCircuitElement, { type: T }>>

/**
 * What a post-routing hook receives. It runs after autorouting and teardrops,
 * before copper pours, via stitching and PCB design rule checks, so whatever it
 * changes is poured around, checked and exported.
 *
 * Every change made through the context is recorded. Before the hook runs
 * again (after re-routing), the recorded changes are undone, so the hook always
 * starts from the routed board.
 */
export interface PcbPostRoutingHookContext {
  /** subcircuit_id of the board or subcircuit group running the hook. */
  readonly subcircuitId: string | undefined
  /**
   * The circuit as it is now, including the hook's own changes so far. Returns
   * a copy; edit through insert/update/remove.
   */
  getCircuitJson(): AnyCircuitElement[]
  /**
   * The pcb_port for a selector relative to the group running the hook, e.g.
   * ".U1 > .pin1". Use its pcb_port_id and pcb_component_id to attach copper to
   * a port's component and net.
   */
  getPcbPort(selector: string): PcbPort | undefined
  /** The pcb_component for a selector relative to the group, e.g. ".U1". */
  getPcbComponent(selector: string): PcbComponent | undefined
  /** Inserts a PCB element and returns it with its generated id. */
  insert<T extends PcbCircuitElementType>(
    element: PcbPostRoutingHookElementInput<T>,
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
 * User code that edits the PCB after routing: add test pads where the routed
 * traces left room, move silkscreen off copper, add vias or keepouts, report
 * custom design rule errors as pcb_*_error elements. May be async. Should be
 * deterministic: it runs again whenever routing is redone, starting from the
 * routed board each time.
 */
export type PcbPostRoutingHook = (
  context: PcbPostRoutingHookContext,
) => void | Promise<void>
