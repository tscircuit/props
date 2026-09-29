import { url } from "lib/common/url"
import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AssemblyScreenProps {
  /** Stable product-level identity for the screen assembly. */
  name: string
  /** Imported CAD model URL. Mutually exclusive with cadModel where supported. */
  modelUrl?: string
  /** Selector for the connector that the screen attaches to. */
  connectsTo: string
  /**
   * Outer width of the screen body, including its bezel but excluding the flex
   * cable. When supplied, it must be provided together with `height`.
   */
  width?: Distance
  /**
   * Outer height of the screen body, including its bezel but excluding the flex
   * cable. When supplied, it must be provided together with `width`.
   */
  height?: Distance
  /**
   * Advanced modelprinter string used to render the screen assembly. Required
   * when `width`, `height`, and `modelUrl` are omitted.
   */
  cadModel?: string
}

const nonemptyString = (fieldName: "name" | "connectsTo" | "cadModel") =>
  z.string().refine((value) => value.trim().length > 0, {
    message: `${fieldName} cannot be empty`,
  })

const positiveDistance = (fieldName: "width" | "height") =>
  distance.refine((value) => Number.isFinite(value) && value > 0, {
    message: `${fieldName} must be a positive finite distance`,
  })

export const assemblyScreenProps = z
  .object({
    name: nonemptyString("name"),
    modelUrl: url
      .refine((value) => value.trim().length > 0, {
        message: "modelUrl cannot be empty",
      })
      .optional(),
    connectsTo: nonemptyString("connectsTo"),
    width: positiveDistance("width").optional(),
    height: positiveDistance("height").optional(),
    cadModel: nonemptyString("cadModel").optional(),
  })
  .superRefine((screen, context) => {
    if (screen.modelUrl !== undefined && screen.cadModel !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either modelUrl or cadModel, not both",
        path: ["modelUrl"],
      })
    }
    const hasWidth = screen.width !== undefined
    const hasHeight = screen.height !== undefined

    if (hasWidth !== hasHeight) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "width and height must be provided together",
        path: hasWidth ? ["height"] : ["width"],
      })
      return
    }

    if (
      !hasWidth &&
      screen.cadModel === undefined &&
      screen.modelUrl === undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "provide width and height, cadModel, or modelUrl",
        path: [],
      })
    }
  })

export type AssemblyScreenPropsInput = z.input<typeof assemblyScreenProps>

expectTypesMatch<AssemblyScreenProps, AssemblyScreenPropsInput>(true)
