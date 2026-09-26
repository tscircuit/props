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

export interface BoardOutlinePoint extends Point {
  /** Marks this outline point as the center of a castellated plated hole */
  isCastellatedHole?: boolean
  /** Diameter of the drilled hole. Required when `isCastellatedHole` is true. */
  holeDiameter?: Distance
  /** Diameter of the copper pad. Required when `isCastellatedHole` is true. */
  padDiameter?: Distance
  /** Connection target or targets for the castellated hole */
  connectsTo?: string | string[]
}

export const boardOutlinePoint = z
  .object({
    ...point.shape,
    isCastellatedHole: z.boolean().optional(),
    holeDiameter: distance.optional(),
    padDiameter: distance.optional(),
    connectsTo: z.string().or(z.array(z.string())).optional(),
  })
  .superRefine((outlinePoint, ctx) => {
    if (outlinePoint.isCastellatedHole) {
      if (outlinePoint.holeDiameter === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["holeDiameter"],
          message: "holeDiameter is required for a castellated hole",
        })
      }
      if (outlinePoint.padDiameter === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["padDiameter"],
          message: "padDiameter is required for a castellated hole",
        })
      }
      return
    }

    if (
      outlinePoint.holeDiameter !== undefined ||
      outlinePoint.padDiameter !== undefined ||
      outlinePoint.connectsTo !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isCastellatedHole"],
        message:
          "isCastellatedHole must be true when castellated hole props are provided",
      })
    }
  })

export interface BoardProps
  extends Omit<SubcircuitGroupProps, "subcircuit" | "connections" | "outline"> {
  title?: string
  /** Fabricator preset, preserved as supplied. Omitted leaves the preset unset. */
  fabricatorPreset?:
    | "jlcpcb_economy"
    | "jlcpcb_standard"
    | "jlcpcb_economy_20260912"
    | "jlcpcb_standard_20260912"
  material?: "fr4" | "fr1" | "flex"
  /** Number of layers for the PCB */
  layers?: 1 | 2 | 4 | 6 | 8 | 10
  /**
   * Whether the autorouter may generate blind and buried vias. Defaults to
   * false, which restricts newly generated vias to the full board stack.
   */
  allowBlindAndBuriedVias?: boolean
  /**
   * Whether to route remaining unrouted connections after explicit routing phases.
   * Omitted leaves the setting unset, preserving the consumer's default behavior.
   */
  routeRemaining?: boolean
  defaultViaTenting?:
    | boolean
    | "both_sides"
    | "top_and_bottom_tented"
    | "top_tented"
    | "bottom_tented"
    | "exposed"
  plugVias?: boolean
  borderRadius?: Distance
  thickness?: Distance
  boardAnchorPosition?: Point
  anchorAlignment?: z.infer<typeof ninePointAnchor>
  boardAnchorAlignment?: z.infer<typeof ninePointAnchor>
  /**
   * Points defining the board edge. Set `isCastellatedHole` on a point to
   * place a castellated plated hole centered on that location.
   *
   * @example
   * ```tsx
   * { x: "-5mm", y: 0, isCastellatedHole: true,
   *   holeDiameter: "0.8mm", padDiameter: "1.2mm",
   *   connectsTo: "net.GND" }
   * ```
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
  /**
   * Whether implicit copper pours should be generated automatically. Defaults
   * to false.
   */
  automaticPoursEnabled?: boolean
  /** Whether to stitch copper pours on the same net across layers with vias. Defaults to false. */
  enableViaStitching?: boolean
  /** Positive center-to-center stitching via spacing in millimeters or a unit string. Omitted uses the solver default. Does not enable stitching by itself. */
  viaStitchPitch?: Distance
  /** Whether this board should be omitted from the schematic view */
  schematicDisabled?: boolean
}

export const boardProps = subcircuitGroupProps
  .omit({ connections: true })
  .extend({
    fabricatorPreset: z
      .enum([
        "jlcpcb_economy",
        "jlcpcb_standard",
        "jlcpcb_economy_20260912",
        "jlcpcb_standard_20260912",
      ])
      .optional()
      .describe(
        "Fabricator preset, preserved as supplied. Omitted leaves the preset unset.",
      ),
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
    routeRemaining: z
      .boolean()
      .optional()
      .describe(
        "Whether to route remaining unrouted connections after explicit routing phases. Boolean values are preserved; omitted leaves the setting unset. No aliases or prop conflicts are introduced, and existing boards require no migration.",
      ),
    defaultViaTenting: z
      .union([
        z.boolean(),
        z.enum([
          "both_sides",
          "top_and_bottom_tented",
          "top_tented",
          "bottom_tented",
          "exposed",
        ]),
      ])
      .transform((value) => {
        if (value === true || value === "both_sides") {
          return "top_and_bottom_tented" as const
        }
        if (value === false) return "exposed" as const
        return value
      })
      .optional(),
    plugVias: z.boolean().optional(),
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
    automaticPoursEnabled: z
      .boolean()
      .default(false)
      .describe(
        "Whether implicit copper pours should be generated automatically. Defaults to false.",
      ),
    enableViaStitching: z
      .boolean()
      .default(false)
      .describe(
        "Whether to stitch copper pours on the same net across layers with vias. Defaults to false.",
      ),
    viaStitchPitch: distance
      .pipe(z.number().positive().finite())
      .optional()
      .describe(
        "Positive center-to-center stitching via spacing in millimeters or a unit string, parsed to millimeters. Omitted uses the solver default. Does not enable stitching by itself.",
      ),
    schematicDisabled: z.boolean().optional(),
  })

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardOutlinePoint, z.input<typeof boardOutlinePoint>>(true)
expectTypesMatch<BoardProps, InferredBoardProps>(true)
