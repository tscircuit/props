import { expect, test } from "bun:test"
import {
  analogMeasurementProps,
  type AnalogMeasurementProps,
} from "lib/components/analogmeasurement"

test("parses transient measurement props without executing the callback", () => {
  const rawProps: AnalogMeasurementProps = {
    name: "settled-output-voltage",
    unit: "V",
    measureFn: ({ getVoltage }) =>
      getVoltage("net.VOUT").values.at(-1) ?? Number.NaN,
  }

  const parsedProps = analogMeasurementProps.parse(rawProps)
  expect(parsedProps.name).toBe("settled-output-voltage")
  expect(parsedProps.unit).toBe("V")
  expect(parsedProps.measureFn).toBe(rawProps.measureFn)
})
