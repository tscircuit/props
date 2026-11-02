import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"

export interface PanelSizeConstraints {
  minWidth?: Distance
  maxWidth?: Distance
  minHeight?: Distance
  maxHeight?: Distance
}

const positiveDistance = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres > 0,
  { message: "Panel size constraints must be finite positive distances" },
)

export const panelSizeConstraints = z
  .object({
    minWidth: positiveDistance.optional(),
    maxWidth: positiveDistance.optional(),
    minHeight: positiveDistance.optional(),
    maxHeight: positiveDistance.optional(),
  })
  .strict()
  .refine(
    (constraints) =>
      constraints.minWidth === undefined ||
      constraints.maxWidth === undefined ||
      constraints.minWidth <= constraints.maxWidth,
    {
      path: ["maxWidth"],
      message: "Panel maxWidth must be greater than or equal to minWidth",
    },
  )
  .refine(
    (constraints) =>
      constraints.minHeight === undefined ||
      constraints.maxHeight === undefined ||
      constraints.minHeight <= constraints.maxHeight,
    {
      path: ["maxHeight"],
      message: "Panel maxHeight must be greater than or equal to minHeight",
    },
  )
