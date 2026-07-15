import { enclosureFdmBoxProps } from "./fdm/box"

export * from "./fdm"

export const enclosureProps = {
  fdm: {
    Box: enclosureFdmBoxProps,
  },
} as const
