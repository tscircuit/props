import type { AutocompleteString } from "../common/autocomplete"

export const footprinterStringExamples = [
  "0402_p1.02mm_pw0.54mm_ph0.64mm_w1.56mm_h0.64mm",
  "0603_p1.65mm_pw0.8mm_ph0.95mm_w2.45mm_h0.95mm",
  "0805_p1.825mm_pw1.025mm_ph1.4mm_w2.85mm_h1.4mm",
  "1206_p2.925mm_pw1.125mm_ph1.75mm_w4.05mm_h1.75mm",
  "1210_p2.925mm_pw1.125mm_ph2.65mm_w4.05mm_h2.65mm",
  "dip6_w7.62mm_p2.54mm_id1mm_od1.5mm",
  "axial_p2.54mm_id0.7mm_od1.4mm",
  "soic8_w5.3mm_p1.27mm_pw0.6mm_pl1mm",
  "bga64_grid8x8_p0.8mm_ball0.47mm_pad0.38mm_tlorigin",
  "tssop8_w7.1mm_p0.65mm_pl1.35mm_pw0.4mm_legsoutside",
  "stampboard_w22.58mm_left20_right20_top2_bottom2_p2.54mm_pw1.6mm_pl2.4mm_innerholeedgedistance1.61mm_silkscreenlabelmargin0.1mm",
  "stampreceiver_w22.58mm_left20_right20_top2_bottom2_p2.54mm_pw1.6mm_pl3.2mm_innerholeedgedistance1.61mm",
  "hc49_p4.88mm_id0.8mm_od1.5mm_w5.6mm_h3.5mm",
  "to92_p1.27mm_id0.72mm_od0.95mm_w4.5mm_h4.5mm",
  "to220_3_p2.6mm_id1mm_od1.9mm_w13mm_h7mm",
  "ssop8_w3.9mm_p1.27mm_pw0.6mm_pl1mm",
  "qfp64_w10mm_h10mm_p0.5mm_pw0.25mm_pl1mm_legsoutside",
  "qfn64_w10mm_h10mm_p0.5mm_pw0.25mm_pl0.875mm",
  "sot23_w1.92mm_h2.74mm_p0.95mm_pl0.8mm_pw0.764mm",
  "sot23_5_w1.92mm_h2.74mm_p0.95mm_pl0.8mm_pw0.764mm",
  "sot223_w8.5mm_h6.9mm_p2.3mm_pl2mm_pw1.5mm",
  "pinrow6_rows1_p2.54mm_id1mm_od1.5mm_male",
] as const

export type FootprinterStringExample =
  (typeof footprinterStringExamples)[number]

export type FootprinterAutocompleteString =
  AutocompleteString<FootprinterStringExample>
