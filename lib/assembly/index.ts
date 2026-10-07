import { assemblyCadAssemblyProps } from "./cadassembly"
import { assemblyCableProps } from "./cable"
import { assemblyDeviceProps } from "./device"
import { assemblyPartProps } from "./part"
import { assemblyPrintedPartProps } from "./printedpart"
import { assemblyMotorProps } from "./motor"
import { assemblyScreenProps } from "./screen"
import { assemblySubassemblyProps } from "./subassembly"

export * from "./board-mounting"
export * from "./cable"
export * from "./device"
export * from "./motor"
export * from "./part"
export * from "./printedpart"
export * from "./screen"
export * from "./subassembly"
export * from "./cadassembly"

export const assemblyProps = {
  cable: assemblyCableProps,
  device: assemblyDeviceProps,
  motor: assemblyMotorProps,
  part: assemblyPartProps,
  printedpart: assemblyPrintedPartProps,
  screen: assemblyScreenProps,
  subassembly: assemblySubassemblyProps,
  cadassembly: assemblyCadAssemblyProps,
} as const
