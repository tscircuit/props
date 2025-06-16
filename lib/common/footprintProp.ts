import type { LayerRef } from "circuit-json"
import type { ReactElement } from "react"
import { z } from "zod"

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

export type FootprintProp = string | ReactElement | FootprintSoupElements[]
export const footprintProp = z.custom<FootprintProp>((v) => true)
