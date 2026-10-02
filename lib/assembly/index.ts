import { assemblyCadAssemblyProps } from "./cadassembly"
import { assemblyDeviceProps } from "./device"
import { assemblyMotorProps } from "./motor"
import { assemblyScreenProps } from "./screen"
import { assemblySubassemblyProps } from "./subassembly"

export * from "./device"
export * from "./motor"
export * from "./screen"
export * from "./subassembly"
export * from "./cadassembly"

export const assemblyProps = {
  device: assemblyDeviceProps,
  motor: assemblyMotorProps,
  screen: assemblyScreenProps,
  subassembly: assemblySubassemblyProps,
  cadassembly: assemblyCadAssemblyProps,
} as const
