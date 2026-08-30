import { assemblyDeviceProps } from "./device"
import { assemblyScreenProps } from "./screen"

export * from "./device"
export * from "./screen"

export const assemblyProps = {
  device: assemblyDeviceProps,
  screen: assemblyScreenProps,
} as const
