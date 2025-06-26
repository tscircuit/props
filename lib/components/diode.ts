import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"

const diodeConnectionKeys = z.enum([
  "anode",
  "cathode",
  "pin1",
  "pin2",
  "pos",
  "neg",
])

const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z.record(diodeConnectionKeys, connectionTarget)

const diodeVariant = z.enum(["standard", "schottky", "zener", "photo", "tvs"])

export const diodeProps = commonComponentProps
  .extend({
    connections: connectionsProp.optional(),
    variant: diodeVariant.optional().default("standard"),
    standard: z.boolean().optional(),
    schottky: z.boolean().optional(),
    zener: z.boolean().optional(),
    photo: z.boolean().optional(),
    tvs: z.boolean().optional(),
    schOrientation: schematicOrientation.optional(),
  })
  .superRefine((data, ctx) => {
    // Check if multiple boolean flags are set directly
    const enabledFlags = [
      data.standard,
      data.schottky,
      data.zener,
      data.photo,
      data.tvs,
    ].filter(Boolean).length

    if (enabledFlags > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one diode variant must be enabled",
        path: [],
      })
      return z.INVALID
    }
  })
  .transform((data) => {
    // Set all variant flags to false initially
    const result = {
      ...data,
      standard: false,
      schottky: false,
      zener: false,
      photo: false,
      tvs: false,
    }

    if (data.standard) result.standard = true
    else if (data.schottky) result.schottky = true
    else if (data.zener) result.zener = true
    else if (data.photo) result.photo = true
    else if (data.tvs) result.tvs = true
    else {
      switch (data.variant) {
        case "standard":
          result.standard = true
          break
        case "schottky":
          result.schottky = true
          break
        case "zener":
          result.zener = true
          break
        case "photo":
          result.photo = true
          break
        case "tvs":
          result.tvs = true
          break
        default:
          result.standard = true
      }
    }

    return result
  })

export const diodePins = lrPolarPins
export type DiodePinLabels = (typeof diodePins)[number]

export interface DiodeProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections?: {
    anode?: string | string[] | readonly string[]
    cathode?: string | string[] | readonly string[]
    pin1?: string | string[] | readonly string[]
    pin2?: string | string[] | readonly string[]
    pos?: string | string[] | readonly string[]
    neg?: string | string[] | readonly string[]
  }
  variant?: "standard" | "schottky" | "zener" | "photo" | "tvs"
  standard?: boolean
  schottky?: boolean
  zener?: boolean
  photo?: boolean
  tvs?: boolean
  schOrientation?: SchematicOrientation
}

export type InferredDiodeProps = z.input<typeof diodeProps>
expectTypesMatch<InferredDiodeProps, DiodeProps>(true)
