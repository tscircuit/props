import { assemblyDeviceProps } from "./device"

export * from "./device"

export const assemblyProps = {
  device: assemblyDeviceProps,
} as const
