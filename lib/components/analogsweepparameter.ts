import {
  capacitance,
  current,
  inductance,
  resistance,
  voltage,
} from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AnalogSweepCoordinatesProps {
  /** Stable identity for this sweep parameter. */
  name?: string
  /** Explicit parameter coordinates. Cannot be combined with start/stop/step. */
  values?: Array<number | string>
  /** First generated parameter coordinate. Requires stop and step. */
  start?: number | string
  /** Last generated parameter coordinate. Requires start and step. */
  stop?: number | string
  /** Nonzero parameter increment directed from start toward stop. */
  step?: number | string
  /** Optional graph coordinates corresponding one-to-one with the physical sweep values. */
  displayValues?: number[]
  /** Unit for displayValues. Required when displayValues is provided. */
  displayUnit?: string
}

export interface AnalogResistanceSweepParameterProps
  extends AnalogSweepCoordinatesProps {
  parameterType: "resistance"
  /** Selector for the resistor whose simulation-only resistance is swept. */
  resistorRef: string
}

export interface AnalogCapacitanceSweepParameterProps
  extends AnalogSweepCoordinatesProps {
  parameterType: "capacitance"
  /** Selector for the capacitor whose simulation-only capacitance is swept. */
  capacitorRef: string
}

export interface AnalogInductanceSweepParameterProps
  extends AnalogSweepCoordinatesProps {
  parameterType: "inductance"
  /** Selector for the inductor whose simulation-only inductance is swept. */
  inductorRef: string
}

export interface AnalogVoltageSweepParameterProps
  extends AnalogSweepCoordinatesProps {
  parameterType: "voltage"
  /** Net whose simulation-only voltage is swept. */
  net: string
}

export interface AnalogCurrentSweepParameterProps
  extends AnalogSweepCoordinatesProps {
  parameterType: "current"
  /** Selector for the current source whose simulation-only current is swept. */
  currentSourceRef: string
}

const resistanceSweepQuantity = resistance.pipe(z.number())
const capacitanceSweepQuantity = capacitance.pipe(z.number())
const inductanceSweepQuantity = inductance.pipe(z.number())
const voltageSweepQuantity = voltage.pipe(z.number())
const currentSweepQuantity = current.pipe(z.number())

const createAnalogSweepCoordinateProps = (
  sweepQuantity: z.ZodType<number, z.ZodTypeDef, number | string>,
) => ({
  name: z.string().optional(),
  values: z.array(sweepQuantity).min(1).optional(),
  start: sweepQuantity.optional(),
  stop: sweepQuantity.optional(),
  step: sweepQuantity.optional(),
  displayValues: z.array(z.number().finite()).min(1).optional(),
  displayUnit: z.string().min(1).optional(),
})

export const analogResistanceSweepParameterProps = z
  .object({
    ...createAnalogSweepCoordinateProps(resistanceSweepQuantity),
    parameterType: z.literal("resistance"),
    resistorRef: z.string().min(1),
  })
  .strict()

export const analogCapacitanceSweepParameterProps = z
  .object({
    ...createAnalogSweepCoordinateProps(capacitanceSweepQuantity),
    parameterType: z.literal("capacitance"),
    capacitorRef: z.string().min(1),
  })
  .strict()

export const analogInductanceSweepParameterProps = z
  .object({
    ...createAnalogSweepCoordinateProps(inductanceSweepQuantity),
    parameterType: z.literal("inductance"),
    inductorRef: z.string().min(1),
  })
  .strict()

export const analogVoltageSweepParameterProps = z
  .object({
    ...createAnalogSweepCoordinateProps(voltageSweepQuantity),
    parameterType: z.literal("voltage"),
    net: z.string().min(1),
  })
  .strict()

export const analogCurrentSweepParameterProps = z
  .object({
    ...createAnalogSweepCoordinateProps(currentSweepQuantity),
    parameterType: z.literal("current"),
    currentSourceRef: z.string().min(1),
  })
  .strict()

interface ParsedAnalogSweepCoordinates {
  values?: number[]
  start?: number
  stop?: number
  step?: number
  displayValues?: number[]
  displayUnit?: string
}

const validateAnalogSweepCoordinates = (
  sweepCoordinates: ParsedAnalogSweepCoordinates,
  context: z.RefinementCtx,
) => {
  const hasExplicitSweepCoordinates = sweepCoordinates.values !== undefined
  const rangeCoordinateCount = [
    sweepCoordinates.start,
    sweepCoordinates.stop,
    sweepCoordinates.step,
  ].filter((rangeCoordinate) => rangeCoordinate !== undefined).length
  const hasRangeCoordinates = rangeCoordinateCount > 0

  if (hasExplicitSweepCoordinates === hasRangeCoordinates) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Provide either values or start/stop/step",
    })
    return
  }

  const hasDisplayValues = sweepCoordinates.displayValues !== undefined
  const hasDisplayUnit = sweepCoordinates.displayUnit !== undefined
  if (hasDisplayValues !== hasDisplayUnit) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "displayValues and displayUnit must be provided together",
    })
  }
  if (
    sweepCoordinates.values &&
    sweepCoordinates.displayValues &&
    sweepCoordinates.values.length !== sweepCoordinates.displayValues.length
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["displayValues"],
      message: "displayValues and values must have the same length",
    })
  }

  if (rangeCoordinateCount !== 0 && rangeCoordinateCount !== 3) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "start, stop, and step must be provided together",
    })
    return
  }

  if (sweepCoordinates.step === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["step"],
      message: "step must be nonzero",
    })
  }

  if (
    sweepCoordinates.start !== undefined &&
    sweepCoordinates.stop !== undefined &&
    sweepCoordinates.step !== undefined &&
    Math.sign(sweepCoordinates.stop - sweepCoordinates.start) !==
      Math.sign(sweepCoordinates.step)
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["step"],
      message: "step must move from start toward stop",
    })
  }
}

export type AnalogSweepParameterProps =
  | AnalogResistanceSweepParameterProps
  | AnalogCapacitanceSweepParameterProps
  | AnalogInductanceSweepParameterProps
  | AnalogVoltageSweepParameterProps
  | AnalogCurrentSweepParameterProps

export const analogSweepParameterProps = z
  .discriminatedUnion("parameterType", [
    analogResistanceSweepParameterProps,
    analogCapacitanceSweepParameterProps,
    analogInductanceSweepParameterProps,
    analogVoltageSweepParameterProps,
    analogCurrentSweepParameterProps,
  ])
  .superRefine(validateAnalogSweepCoordinates)

expectTypesMatch<
  AnalogResistanceSweepParameterProps,
  z.input<typeof analogResistanceSweepParameterProps>
>(true)
expectTypesMatch<
  AnalogCapacitanceSweepParameterProps,
  z.input<typeof analogCapacitanceSweepParameterProps>
>(true)
expectTypesMatch<
  AnalogInductanceSweepParameterProps,
  z.input<typeof analogInductanceSweepParameterProps>
>(true)
expectTypesMatch<
  AnalogVoltageSweepParameterProps,
  z.input<typeof analogVoltageSweepParameterProps>
>(true)
expectTypesMatch<
  AnalogCurrentSweepParameterProps,
  z.input<typeof analogCurrentSweepParameterProps>
>(true)
expectTypesMatch<
  AnalogSweepParameterProps,
  z.input<typeof analogSweepParameterProps>
>(true)
