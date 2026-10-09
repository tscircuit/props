import { layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { positiveQuantity } from "../simulation/strict-quantity"

/** A signal driver/load pair and its explicit ground return terminals.
 * Selectors resolve inside the containing board/subcircuit. The initial core
 * implementation accepts physical PCB ports/pads, not standalone via contacts.
 * This definition neither connects the selected pins nor runs a simulation.
 */
export interface PcbReturnCurrentExcitationProps {
  /** Readable excitation name for diagnostics; not stored on its Circuit JSON record. */
  name?: string
  /** Signal driver port selector, e.g. ".U1 > .OUT". */
  source: string
  /** Signal receiving port selector, e.g. ".U2 > .IN". */
  load: string
  /** Ground net selector, e.g. "net.GND"; its copper and connections must already exist. */
  ground: string
  /** Positive in-phase peak signal current. Numbers are amperes, not RMS; strings use ampere units. */
  current: number | string
  /** Load-side GND port where positive return current enters the return conductor. */
  returnSource: string
  /** Driver-side GND port where positive return current leaves the return conductor. */
  returnSink: string
  /** Positive real source-port resistance. Numbers are ohms; complex impedances are unsupported. */
  sourceImpedance: number | string
  /** Positive real load-port resistance. Numbers are ohms; complex impedances are unsupported. */
  loadImpedance: number | string
  /** Optional trace selector to disambiguate multiple routes between the signal ports. */
  trace?: string
  /** Contact layer for a load-side PCB port spanning multiple copper layers. */
  returnSourceLayer?: LayerRefInput
  /** Contact layer for a driver-side PCB port spanning multiple copper layers. */
  returnSinkLayer?: LayerRefInput
}

const selector = z.string().trim().min(1, "Provide a nonempty selector")
const positiveCurrent = positiveQuantity("A", "peak amperes", "5mA")
const positiveResistance = positiveQuantity(
  "ohms?|Ohms?|Ω",
  "real ohms",
  "100ohm",
)

export const pcbReturnCurrentExcitationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    source: selector,
    load: selector,
    ground: selector,
    current: positiveCurrent,
    returnSource: selector,
    returnSink: selector,
    sourceImpedance: positiveResistance,
    loadImpedance: positiveResistance,
    trace: selector.optional(),
    returnSourceLayer: layer_ref.optional(),
    returnSinkLayer: layer_ref.optional(),
  })
  .strict()

expectTypesMatch<
  PcbReturnCurrentExcitationProps,
  z.input<typeof pcbReturnCurrentExcitationProps>
>(true)
