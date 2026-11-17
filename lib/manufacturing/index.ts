import { manufacturingLaserEngravingImageProps } from "./laserengraving/image"
import { manufacturingLaserEngravingTextProps } from "./laserengraving/text"

export * from "./laserengraving"
export {
  manufacturingBuiltInSurfaces,
  type ManufacturingBuiltInSurface,
  type ManufacturingSurfacePlacementProps,
  type ManufacturingSurfaceRef,
} from "./surface-placement"

export const manufacturingProps = {
  laserengraving: {
    image: manufacturingLaserEngravingImageProps,
    text: manufacturingLaserEngravingTextProps,
  },
} as const
