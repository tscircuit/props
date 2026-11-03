import { systemBlockPageProps } from "../components/system-block-page"
import { systemBlockGroupProps } from "../components/system-block-group"
import { systemBlockComponentProps } from "../components/system-block-component"
import { systemBlockConnectionProps } from "../components/system-block-connection"

export * from "../components/system-block-page"
export * from "../components/system-block-group"
export * from "../components/system-block-component"
export * from "../components/system-block-connection"
export type { SystemBlockPcbReferenceProps } from "./pcb-reference"

/** Validators for the systemblock JSX namespace; rendering is supplied by core. */
export const systemBlockProps = {
  page: systemBlockPageProps,
  group: systemBlockGroupProps,
  component: systemBlockComponentProps,
  connection: systemBlockConnectionProps,
} as const
