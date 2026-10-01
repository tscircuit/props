import { z } from "zod"
import { bit_rate } from "circuit-json"
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
  /** Initial GPIO level after driver initialization, not the silicon reset state. No default. */
  initialOutputState?: "low" | "high"
  /** GPIO interrupt selection. Use "none" to explicitly disable interrupts. */
  interruptTrigger?: "none" | "rising" | "falling" | "both"
  /** Maximum I2C bus bit rate on the configured MCU SCL pin. Numbers are bits/s; e.g. "100kbps". */
  i2cMaxBitRate?: number | string
  /** Leave this pin outside generated firmware configuration, for example for debug ownership. */
  doNotConfigure?: boolean
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
  initialOutputState: z.enum(["low", "high"]).optional(),
  interruptTrigger: z.enum(["none", "rising", "falling", "both"]).optional(),
  i2cMaxBitRate: bit_rate.optional(),
  doNotConfigure: z.boolean().optional(),
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

/** Canonical pin attributes after unit normalization. */
export type ParsedPinAttributeMap = z.output<typeof pinAttributeMap>
