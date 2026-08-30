import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { type PcbPath, pcbPath } from "lib/common/pcbPath"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** PCB-trace antenna topologies that can be generated from design intent. */
export const antennaShapes = [
  "quarter_wave_monopole",
  "meandered_monopole",
  "inverted_f",
  "meandered_inverted_f",
  "folded_dipole",
] as const

export type AntennaShape = (typeof antennaShapes)[number]
export const antennaShape = z.enum(antennaShapes)

/** Wi-Fi and Bluetooth radio standards commonly used with PCB antennas. */
export const antennaWirelessStandards = [
  "wifi_802_11a",
  "wifi_802_11b",
  "wifi_802_11g",
  "wifi_802_11n",
  "wifi_802_11ac",
  "wifi_802_11ax",
  "wifi_802_11be",
  "bluetooth_classic",
  "bluetooth_le",
] as const

export type AntennaWirelessStandard = (typeof antennaWirelessStandards)[number]
export const antennaWirelessStandard = z.enum(antennaWirelessStandards)

/** Nominal Wi-Fi and Bluetooth operating-band configurations. */
export const antennaFrequencyBands = [
  "2.4ghz",
  "5ghz",
  "6ghz",
  "dual_band_2.4ghz_5ghz",
  "tri_band_2.4ghz_5ghz_6ghz",
] as const

export type AntennaFrequencyBand = (typeof antennaFrequencyBands)[number]
export const antennaFrequencyBand = z.enum(antennaFrequencyBands)

/** Props for an antenna component with optional generated or explicit geometry. */
export interface AntennaProps extends CommonComponentProps {
  /**
   * PCB-trace topology to generate. No shape is assumed when omitted. An
   * explicit pcbPath takes precedence when both are provided.
   */
  antennaShape?: AntennaShape
  /** Wi-Fi or Bluetooth radio standard. No standard is assumed when omitted. */
  wirelessStandard?: AntennaWirelessStandard
  /** Nominal operating band or multiband configuration. */
  frequencyBand?: AntennaFrequencyBand
  /**
   * Explicit antenna path. Entries use the same selector, point, and via
   * syntax as trace pcbPath entries.
   */
  pcbPath?: PcbPath
}

export const antennaProps = commonComponentProps.extend({
  antennaShape: antennaShape.optional(),
  wirelessStandard: antennaWirelessStandard.optional(),
  frequencyBand: antennaFrequencyBand.optional(),
  pcbPath: pcbPath.optional(),
})

type InferredAntennaProps = z.input<typeof antennaProps>
expectTypesMatch<AntennaProps, InferredAntennaProps>(true)
