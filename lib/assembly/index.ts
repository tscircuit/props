import { assemblyCadAssemblyProps } from "./cadassembly"
import { assemblyCableProps } from "./cable"
import { assemblyDeviceProps } from "./device"
import { assemblyPrintedPartProps } from "./printedpart"
import { assemblyMotorProps } from "./motor"
import { assemblyScreenProps } from "./screen"
import { assemblySubassemblyProps } from "./subassembly"

export * from "./board-mounting"
export * from "./cable"
export * from "./cable-connector"
export * from "./device"
export * from "./motor"
export * from "./printedpart"
export * from "./screen"
export * from "./subassembly"
export * from "./cadassembly"

export const assemblyProps = {
  cable: assemblyCableProps,
  device: assemblyDeviceProps,
  motor: assemblyMotorProps,
  printedpart: assemblyPrintedPartProps,
  screen: assemblyScreenProps,
  subassembly: assemblySubassemblyProps,
  cadassembly: assemblyCadAssemblyProps,
} as const
