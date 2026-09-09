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
  /** Whether the pin accepts a signal. Combine with isOutput for bidirectional pins. */
  isInput?: boolean
  /** Whether the pin drives a signal. Combine with isInput for bidirectional pins. */
  isOutput?: boolean
  /** Whether the pin is a passive component terminal. */
  isPassive?: boolean
  /** Whether the pin has no electrical function but may be connected; distinct from doNotConnect. */
  isFree?: boolean
  /** Whether the electrical role is explicitly unknown; omission makes no declaration. */
  isUnspecified?: boolean
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
  isInput: z.boolean().optional(),
  isOutput: z.boolean().optional(),
  isPassive: z.boolean().optional(),
  isFree: z.boolean().optional(),
  isUnspecified: z.boolean().optional(),
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
