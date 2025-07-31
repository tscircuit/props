import type { LayerRef } from "circuit-json"
import type { ReactElement } from "react"
import { z } from "zod"
import { type AutocompleteString } from "./autocomplete"

/**
 * This is an abbreviated definition of the soup elements that you can find here:
 * https://docs.tscircuit.com/api-reference/advanced/soup#pcb-smtpad
 */
export type FootprintSoupElements = {
  type: "pcb_smtpad" | "pcb_plated_hole"
  x: string | number
  y: string | number
  layer?: LayerRef
  holeDiameter?: string | number
  outerDiameter?: string | number
  shape?: "circle" | "rect"
  width?: string | number
  height?: string | number
  portHints?: string[]
}

export type BasicFootprint =
  | "0201"
  | "0402"
  | "0603"
  | "0805"
  | "1206"
  | "SOT-23"
  | "SOIC-8"
  | "QFN-32"
  | "TQFP-32"

export type FootprintProp =
  | AutocompleteString<BasicFootprint>
  | ReactElement
  | FootprintSoupElements[]

export const footprintProp = z.custom<FootprintProp>((v) => true)
