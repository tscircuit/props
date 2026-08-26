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

export interface BoardCastellatedHole {
  /** Diameter of the drilled hole */
  holeDiameter: Distance
  /** Diameter of the plated copper surrounding the hole */
  outerDiameter: Distance
  /** Connection target or targets for the castellated hole */
  connectsTo?: string | string[]
}

export const boardCastellatedHole = z.object({
  holeDiameter: distance,
  outerDiameter: distance,
  connectsTo: z.string().or(z.array(z.string())).optional(),
})

export interface BoardOutlinePoint extends Point {
  /**
   * Marks this outline point as the center of a castellated plated hole.
   * The point should lie on the board edge.
   *
   * @example
   * ```tsx
   * { x: "-5mm", y: 0, castellatedHole: {
   *   holeDiameter: "0.8mm",
   *   outerDiameter: "1.2mm",
   *   connectsTo: "net.GND",
   * } }
   * ```
   */
  castellatedHole?: BoardCastellatedHole
}

export const boardOutlinePoint = point.extend({
  castellatedHole: boardCastellatedHole.optional(),
})

export interface BoardProps
  extends Omit<SubcircuitGroupProps, "subcircuit" | "connections" | "outline"> {
  title?: string
  material?: "fr4" | "fr1" | "flex"
  /** Number of layers for the PCB */
  layers?: 1 | 2 | 4 | 6 | 8 | 10
  /**
   * Whether the autorouter may generate blind and buried vias. Defaults to
   * false, which restricts newly generated vias to the full board stack.
   */
  allowBlindAndBuriedVias?: boolean
  borderRadius?: Distance
  thickness?: Distance
  boardAnchorPosition?: Point
  anchorAlignment?: z.infer<typeof ninePointAnchor>
  boardAnchorAlignment?: z.infer<typeof ninePointAnchor>
  /**
   * Points defining the board edge. A point may include a castellated hole
   * centered on that location.
   */
  outline?: BoardOutlinePoint[]
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
  /** Whether vias may be placed inside PCB pads */
  isViaInPadAllowed?: boolean
  /** Whether this board should be omitted from the schematic view */
  schematicDisabled?: boolean
}

export const boardProps = subcircuitGroupProps
  .omit({ connections: true })
  .extend({
    material: z.enum(["fr4", "fr1", "flex"]).default("fr4"),
    layers: z
      .union([
        z.literal(1),
        z.literal(2),
        z.literal(4),
        z.literal(6),
        z.literal(8),
        z.literal(10),
      ])
      .default(2),
    allowBlindAndBuriedVias: z
      .boolean()
      .default(false)
      .describe(
        "Whether the autorouter may generate blind and buried vias. Defaults to false, which restricts newly generated vias to the full board stack.",
      ),
    borderRadius: distance.optional(),
    thickness: distance.optional(),
    boardAnchorPosition: point.optional(),
    anchorAlignment: ninePointAnchor.optional(),
    boardAnchorAlignment: ninePointAnchor
      .optional()
      .describe("Prefer using anchorAlignment when possible"),
    outline: z.array(boardOutlinePoint).optional(),
    title: z.string().optional(),
    solderMaskColor: boardColor.optional(),
    topSolderMaskColor: boardColor.optional(),
    bottomSolderMaskColor: boardColor.optional(),
    silkscreenColor: boardColor.optional(),
    topSilkscreenColor: boardColor.optional(),
    bottomSilkscreenColor: boardColor.optional(),
    doubleSidedAssembly: z.boolean().optional().default(false),
    isViaInPadAllowed: z
      .boolean()
      .optional()
      .describe(
        "Allows intentional via-in-pad designs to pass DRC. Omitted or false keeps via-in-pad disallowed.",
      ),
    schematicDisabled: z.boolean().optional(),
  })

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardCastellatedHole, z.input<typeof boardCastellatedHole>>(
  true,
)
expectTypesMatch<BoardOutlinePoint, z.input<typeof boardOutlinePoint>>(true)
expectTypesMatch<BoardProps, InferredBoardProps>(true)
