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
import { assemblyExplosionProps } from "./explosion"

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
export * from "./explosion"

export const assemblyProps = {
  explosion: assemblyExplosionProps,
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
