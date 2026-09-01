import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { type PcbPath, pcbPath } from "lib/common/pcbPath"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Band-qualified PCB-trace antenna topologies. */
export const antennaShapes = [
  "2.4ghz_quarter_wave_monopole",
  "2.4ghz_meandered_monopole",
  "2.4ghz_inverted_f",
  "2.4ghz_meandered_inverted_f",
  "2.4ghz_folded_dipole",
] as const

export type AntennaShape = (typeof antennaShapes)[number]
export const antennaShape = z.enum(antennaShapes)

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
   * Band-qualified PCB-trace topology to generate. The encoded band is enough
   * to select the geometry without frequencyBand. No shape is assumed when
   * omitted. An explicit pcbPath takes precedence when both are provided.
   */
  antennaShape?: AntennaShape
  /**
   * Nominal operating band or multiband configuration. This is redundant when
   * antennaShape is present; the band encoded in antennaShape controls generated
   * geometry.
   */
  frequencyBand?: AntennaFrequencyBand
  /**
   * Explicit antenna path. Entries use the same selector, point, and via
   * syntax as trace pcbPath entries.
   */
  pcbPath?: PcbPath
}

export const antennaProps = commonComponentProps.extend({
  antennaShape: antennaShape.optional(),
  frequencyBand: antennaFrequencyBand.optional(),
  pcbPath: pcbPath.optional(),
})

type InferredAntennaProps = z.input<typeof antennaProps>
expectTypesMatch<AntennaProps, InferredAntennaProps>(true)
