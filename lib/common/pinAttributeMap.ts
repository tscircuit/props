import { z } from "zod"
import { expectTypesMatch } from "../typecheck"

export const pinCapability = z.enum([
  "i2c_sda",
  "i2c_scl",
  "spi_cs",
  "spi_sck",
  "spi_mosi",
  "spi_miso",
  "uart_tx",
  "uart_rx",
])

export type PinCapability = z.input<typeof pinCapability>

export interface PinAttributeMap {
  /** Explicit roles from the component definition. Omitted flags are unknown; no names are interpreted. */
  /** The pin resets its device when asserted; not a reset output. */
  isResetInput?: boolean
  /** The pin is configured as the USB D+ signal. */
  isUsbDataPositive?: boolean
  /** The pin is configured as the USB D- signal. */
  isUsbDataNegative?: boolean
  /** The positive differential input of a current-sense amplifier. */
  isCurrentSensePositiveInput?: boolean
  /** The negative differential input of a current-sense amplifier. */
  isCurrentSenseNegativeInput?: boolean
  /** The gate terminal of a MOSFET. */
  isMosfetGate?: boolean
  /** A source terminal of a MOSFET. */
  isMosfetSource?: boolean
  /** A drain terminal of a MOSFET. */
  isMosfetDrain?: boolean
  /** The base terminal of a bipolar transistor. */
  isTransistorBase?: boolean
  /** The collector terminal of a bipolar transistor. */
  isTransistorCollector?: boolean
  /** The emitter terminal of a bipolar transistor. */
  isTransistorEmitter?: boolean
  /** The anode terminal of a diode. */
  isDiodeAnode?: boolean
  /** The cathode terminal of a diode. */
  isDiodeCathode?: boolean
  /** The inverting signal input of an operational amplifier. */
  isOpAmpInvertingInput?: boolean
  /** The non-inverting signal input of an operational amplifier. */
  isOpAmpNonInvertingInput?: boolean
  /** The signal output of an operational amplifier. */
  isOpAmpOutput?: boolean
  /** One of the two terminals of a relay coil. */
  isRelayCoil?: boolean
  /** The common terminal of a relay contact set. */
  isRelayCommonContact?: boolean
  /** A relay contact open when the coil is not energized. */
  isRelayNormallyOpenContact?: boolean
  /** A relay contact closed when the coil is not energized. */
  isRelayNormallyClosedContact?: boolean

  /** Whether the pin accepts a signal. */
  isInput?: boolean
  /** Whether the pin drives a signal. */
  isOutput?: boolean
  /** Whether the pin can both accept and drive signals. */
  isBidirectional?: boolean
  /** Whether the pin is a passive component terminal. */
  isPassive?: boolean
  /** Whether the pin supports a high-impedance output state. */
  canUseTriState?: boolean
  /** Whether the pin is configured for tri-state operation, not its instantaneous impedance. */
  isUsingTriState?: boolean
  /** Whether the pin supports an open-collector output. */
  canUseOpenCollector?: boolean
  /** Whether the pin is configured as an open-collector output. */
  isUsingOpenCollector?: boolean
  /** Whether the pin supports an open-emitter output. */
  canUseOpenEmitter?: boolean
  /** Whether the pin is configured as an open-emitter output. */
  isUsingOpenEmitter?: boolean
  capabilities?: Array<PinCapability>
  activeCapabilities?: Array<PinCapability>
  activeCapability?: PinCapability
  providesPower?: boolean
  requiresPower?: boolean
  providesGround?: boolean
  requiresGround?: boolean
  providesVoltage?: string | number
  requiresVoltage?: string | number
  doNotConnect?: boolean
  includeInBoardPinout?: boolean
  highlightColor?: string
  mustBeConnected?: boolean
  canUseInternalPullup?: boolean
  isUsingInternalPullup?: boolean
  needsExternalPullup?: boolean
  canUseInternalPulldown?: boolean
  isUsingInternalPulldown?: boolean
  needsExternalPulldown?: boolean
  canUseOpenDrain?: boolean
  isUsingOpenDrain?: boolean
  canUsePushPull?: boolean
  isUsingPushPull?: boolean
  shouldHaveDecouplingCapacitor?: boolean
  recommendedDecouplingCapacitorCapacitance?: string | number
  isGpio?: boolean
}

export const pinAttributeMap = z.object({
  isResetInput: z.boolean().optional(),
  isUsbDataPositive: z.boolean().optional(),
  isUsbDataNegative: z.boolean().optional(),
  isCurrentSensePositiveInput: z.boolean().optional(),
  isCurrentSenseNegativeInput: z.boolean().optional(),
  isMosfetGate: z.boolean().optional(),
  isMosfetSource: z.boolean().optional(),
  isMosfetDrain: z.boolean().optional(),
  isTransistorBase: z.boolean().optional(),
  isTransistorCollector: z.boolean().optional(),
  isTransistorEmitter: z.boolean().optional(),
  isDiodeAnode: z.boolean().optional(),
  isDiodeCathode: z.boolean().optional(),
  isOpAmpInvertingInput: z.boolean().optional(),
  isOpAmpNonInvertingInput: z.boolean().optional(),
  isOpAmpOutput: z.boolean().optional(),
  isRelayCoil: z.boolean().optional(),
  isRelayCommonContact: z.boolean().optional(),
  isRelayNormallyOpenContact: z.boolean().optional(),
  isRelayNormallyClosedContact: z.boolean().optional(),

  isInput: z.boolean().optional(),
  isOutput: z.boolean().optional(),
  isBidirectional: z.boolean().optional(),
  isPassive: z.boolean().optional(),
  canUseTriState: z.boolean().optional(),
  isUsingTriState: z.boolean().optional(),
  canUseOpenCollector: z.boolean().optional(),
  isUsingOpenCollector: z.boolean().optional(),
  canUseOpenEmitter: z.boolean().optional(),
  isUsingOpenEmitter: z.boolean().optional(),
  capabilities: z.array(pinCapability).optional(),
  activeCapabilities: z.array(pinCapability).optional(),
  activeCapability: pinCapability.optional(),
  providesPower: z.boolean().optional(),
  requiresPower: z.boolean().optional(),
  providesGround: z.boolean().optional(),
  requiresGround: z.boolean().optional(),
  providesVoltage: z.union([z.string(), z.number()]).optional(),
  requiresVoltage: z.union([z.string(), z.number()]).optional(),
  doNotConnect: z.boolean().optional(),
  includeInBoardPinout: z.boolean().optional(),
  highlightColor: z.string().optional(),
  mustBeConnected: z.boolean().optional(),
  canUseInternalPullup: z.boolean().optional(),
  isUsingInternalPullup: z.boolean().optional(),
  needsExternalPullup: z.boolean().optional(),
  canUseInternalPulldown: z.boolean().optional(),
  isUsingInternalPulldown: z.boolean().optional(),
  needsExternalPulldown: z.boolean().optional(),
  canUseOpenDrain: z.boolean().optional(),
  isUsingOpenDrain: z.boolean().optional(),
  canUsePushPull: z.boolean().optional(),
  isUsingPushPull: z.boolean().optional(),
  shouldHaveDecouplingCapacitor: z.boolean().optional(),
  recommendedDecouplingCapacitorCapacitance: z
    .union([z.string(), z.number()])
    .optional(),
  isGpio: z.boolean().optional(),
})

expectTypesMatch<PinAttributeMap, z.input<typeof pinAttributeMap>>(true)
