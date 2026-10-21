import { assemblyDrawingProps } from "./drawing"
import { assemblyDrawingViewProps } from "./drawingview"
import { assemblyCadAssemblyProps } from "./cadassembly"
import { assemblyCableProps } from "./cable"
import { assemblyBoltProps } from "./bolt"
import { assemblyFastenerProps } from "./fastener"
import { assemblyDeviceProps } from "./device"
import { assemblyPartProps } from "./part"
import { assemblyReferenceSurfaceProps } from "./referencesurface"
import { assemblyPrintedPartProps } from "./printedpart"
import { assemblyMotorProps } from "./motor"
import { assemblyScreenProps } from "./screen"
import { assemblySubassemblyProps } from "./subassembly"

export * from "./drawing"
export * from "./drawingview"
export * from "./board-mounting"
export * from "./bolt"
export * from "./fastener"
export * from "./cable"
export * from "./device"
export * from "./motor"
export * from "./part"
export * from "./referencesurface"
export * from "./printedpart"
export * from "./screen"
export * from "./subassembly"
export * from "./cadassembly"

export const assemblyProps = {
  drawing: assemblyDrawingProps,
  drawingview: assemblyDrawingViewProps,
  bolt: assemblyBoltProps,
  fastener: assemblyFastenerProps,
  cable: assemblyCableProps,
  device: assemblyDeviceProps,
  motor: assemblyMotorProps,
  part: assemblyPartProps,
  referencesurface: assemblyReferenceSurfaceProps,
  printedpart: assemblyPrintedPartProps,
  screen: assemblyScreenProps,
  subassembly: assemblySubassemblyProps,
  cadassembly: assemblyCadAssemblyProps,
} as const
