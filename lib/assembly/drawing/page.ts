import { z } from "zod"
import {
  assemblyDrawingPageSize,
  getAssemblyDrawingPageDimensions,
  type AssemblyDrawingPageSize,
} from "./page-size"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A paper-space drawing page containing configured part views. */
export interface AssemblyDrawingPageProps {
  name?: string
  displayName?: string
  /** Standard sheet size; landscape by default. Mutually exclusive with width/height. */
  size?: AssemblyDrawingPageSize
  orientation?: "landscape" | "portrait"
  /** Custom paper dimensions in mm when numeric; unit strings are accepted. */
  width?: Distance
  height?: Distance
  children?: any
}

export const assemblyDrawingPageProps = z
  .object({
    name: z.string().optional(),
    displayName: z.string().optional(),
    size: assemblyDrawingPageSize.optional(),
    orientation: z.enum(["landscape", "portrait"]).optional(),
    width: distance.pipe(z.number().finite().positive()).optional(),
    height: distance.pipe(z.number().finite().positive()).optional(),
    children: z.any().optional(),
  })
  .superRefine((page, ctx) => {
    if (
      page.size
        ? page.width != null || page.height != null
        : page.width == null || page.height == null
    )
      ctx.addIssue({
        code: "custom",
        message: "Specify size or both width and height, exclusively",
      })
    if (!page.size && page.orientation)
      ctx.addIssue({
        code: "custom",
        path: ["orientation"],
        message: "Orientation requires a standard size",
      })
  })
  .transform((page) => ({
    ...page,
    ...(page.size
      ? getAssemblyDrawingPageDimensions(page.size, page.orientation)
      : { width: page.width!, height: page.height! }),
  }))

export type InferredAssemblyDrawingPageProps = z.input<
  typeof assemblyDrawingPageProps
>
expectTypesMatch<
  AssemblyDrawingPageProps,
  z.input<typeof assemblyDrawingPageProps>
>(true)
