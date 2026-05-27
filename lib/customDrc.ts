import type {
  AnyCircuitElement,
  CircuitJsonError,
  PcbComponent,
  PcbPort,
  SourceComponentBase,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { z } from "zod"

type MaybePromise<T> = T | Promise<T>
type CircuitJsonWarning = Extract<AnyCircuitElement, { warning_type: string }>

export type CustomDrcCheckInput =
  | Partial<CircuitJsonError>
  | Partial<CircuitJsonWarning>

export interface SelectionResultComponent {
  getPort: (name: string) => SelectionResultPort | null
  getPorts: () => SelectionResultPort[]
  getPcbComponent: () => PcbComponent | null
  getSourceComponent: () => SourceComponentBase | null
}

export interface SelectionResultPort {
  getPcbPort: () => PcbPort | null
  getSourcePort: () => SourcePort | null
}

export interface SelectionResultNet {
  getSourceNet: () => SourceNet | null
}

export type SelectionResult =
  | SelectionResultComponent
  | SelectionResultPort
  | SelectionResultNet

export type CustomDrcConnectable =
  | string
  | AnyCircuitElement
  | SelectionResult
  | null
  | undefined

export interface CustomDrcSelect {
  (selector: `net.${string}`): SelectionResultNet | null
  (selector: `${string}.${string}`): SelectionResultPort | null
  (selector: string): SelectionResult | null
}

export interface CustomDrcSelectAll {
  (selector: `chip${string}`): SelectionResultComponent[]
  (selector: string): SelectionResult[]
}

export interface CustomDrcCheckContext {
  select: CustomDrcSelect
  selectAll: CustomDrcSelectAll
  isConnected: (a: CustomDrcConnectable, b: CustomDrcConnectable) => boolean
  isPulledUp: (a: CustomDrcConnectable) => boolean
  isPulledDown: (a: CustomDrcConnectable) => boolean
  getResistanceBetween: (
    a: CustomDrcConnectable,
    b: CustomDrcConnectable,
  ) => number | null
}

export type CustomDrcCheckFn = (
  ctx: CustomDrcCheckContext,
) => MaybePromise<
  CustomDrcCheckInput | CustomDrcCheckInput[] | null | undefined | void
>

export const customDrcCheckFn = z.custom<CustomDrcCheckFn>(
  (value) => typeof value === "function",
)
