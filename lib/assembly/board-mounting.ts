import type { AutocompleteString } from "lib/common/autocomplete"
import { z } from "zod"

export type BoardMountRotationAnchor = AutocompleteString<
  "topedge" | "bottomedge" | "leftedge" | "rightedge"
>

export type BoardMountOrientation =
  | "top_layer_toward_mount_face"
  | "bottom_layer_toward_mount_face"

const identityPathPattern =
  "[A-Za-z_][A-Za-z0-9_-]*(?:\\.[A-Za-z_][A-Za-z0-9_-]*)*"
const referencePattern =
  "[A-Za-z_][A-Za-z0-9_-]*(?:\\.[A-Za-z_][A-Za-z0-9_-]*)+"
const reference = new RegExp(`^${referencePattern}$`)
const anchor = new RegExp(`^${identityPathPattern}$`)
const expression = new RegExp(
  `^calc\\(\\s*(${referencePattern})\\s*(?:([+-])\\s*((?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s*(degcw|degccw))?\\s*\\)$`,
)

/** Qualified named direction, optionally adjusted by explicit clockwise or
 * counterclockwise degrees. Keep reference identity and the expression intact
 * for assembly resolution; never evaluate arbitrary arithmetic or scripts.
 */
export const boardMountRotation = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (reference.test(value)) return
    const match = expression.exec(value)
    if (!match) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Expected a qualified mounting reference or calc(reference +/- Ndegcw|Ndegccw)",
      })
      return
    }
    if (match[3] !== undefined && !Number.isFinite(Number(match[3]))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mount rotation angle must be finite",
      })
    }
  })

export const boardMountRotationAnchor = z
  .custom<BoardMountRotationAnchor>((value) => typeof value === "string", {
    message: "Expected a board edge or component identity path",
  })
  .transform((value) => value.trim())
  .refine((value) => anchor.test(value), {
    message: "Expected a board edge or component identity path",
  })

export const boardMountOrientation = z.enum([
  "top_layer_toward_mount_face",
  "bottom_layer_toward_mount_face",
])
