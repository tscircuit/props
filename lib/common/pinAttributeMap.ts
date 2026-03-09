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
