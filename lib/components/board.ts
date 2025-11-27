import type { AutocompleteString } from "lib/common/autocomplete"
import { distance, type Distance } from "lib/common/distance"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

const boardColorPresets = [
  "not_specified",
  "green",
  "red",
  "blue",
  "purple",
  "black",
  "white",
  "yellow",
] as const

export type BoardColorPreset = (typeof boardColorPresets)[number]

export type BoardColor = AutocompleteString<BoardColorPreset>

const boardColor = z.custom<BoardColor>((value) => typeof value === "string")

export interface BoardProps
  extends Omit<SubcircuitGroupProps, "subcircuit" | "connections"> {
  title?: string
  material?: "fr4" | "fr1"
  /** Number of layers for the PCB */
  layers?: 1 | 2 | 4 | 6 | 8
  borderRadius?: Distance
  thickness?: Distance
  boardAnchorPosition?: Point
  boardAnchorAlignment?: z.infer<typeof ninePointAnchor>
  /** Color applied to both top and bottom solder masks */
  solderMaskColor?: BoardColor
  /** Color of the top solder mask */
  topSolderMaskColor?: BoardColor
  /** Color of the bottom solder mask */
  bottomSolderMaskColor?: BoardColor
  /** Color applied to both top and bottom silkscreens */
  silkscreenColor?: BoardColor
  /** Color of the top silkscreen */
  topSilkscreenColor?: BoardColor
  /** Color of the bottom silkscreen */
  bottomSilkscreenColor?: BoardColor
  /** Whether the board should be assembled on both sides */
  doubleSidedAssembly?: boolean
  /** Whether this board should be omitted from the schematic view */
  schematicDisabled?: boolean
}

export const boardProps = subcircuitGroupProps
  .omit({ connections: true })
  .extend({
    material: z.enum(["fr4", "fr1"]).default("fr4"),
    layers: z
      .union([
        z.literal(1),
        z.literal(2),
        z.literal(4),
        z.literal(6),
        z.literal(8),
      ])
      .default(2),
    borderRadius: distance.optional(),
    thickness: distance.optional(),
    boardAnchorPosition: point.optional(),
    boardAnchorAlignment: ninePointAnchor.optional(),
    title: z.string().optional(),
    solderMaskColor: boardColor.optional(),
    topSolderMaskColor: boardColor.optional(),
    bottomSolderMaskColor: boardColor.optional(),
    silkscreenColor: boardColor.optional(),
    topSilkscreenColor: boardColor.optional(),
    bottomSilkscreenColor: boardColor.optional(),
    doubleSidedAssembly: z.boolean().optional().default(false),
    schematicDisabled: z.boolean().optional(),
  })

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardProps, InferredBoardProps>(true)
