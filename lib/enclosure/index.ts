import { enclosureCutoutApertureProps } from "./cutout-aperture"
import { enclosureFdmBoxProps } from "./fdm/box"

export * from "./cutout-aperture"
export * from "./fdm"

export const enclosureProps = {
  cutoutaperture: enclosureCutoutApertureProps,
  fdm: {
    box: enclosureFdmBoxProps,
  },
} as const
