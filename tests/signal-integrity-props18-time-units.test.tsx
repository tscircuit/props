import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps, pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("times parse to seconds and UI offsets retain their relative units", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: "20Mbps",
      duration: "2us",
    }).duration,
  ).toBe(2e-6)
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: "20Mbps",
      duration: "32UI",
    }).duration,
  ).toBe(32 / 20e6)
  expect(
    pcbTransientChannelSimulationProps.parse({ bitRate: 20e6, duration: 2 })
      .duration,
  ).toBe(2)
  expect(pcbChannelProps.parse({ ...data, offset: "2ns" }).offset).toBe(2e-9)
  expect(pcbChannelProps.parse({ ...data, offset: " 0.250 UI " }).offset).toBe(
    "0.25UI",
  )
  expect(pcbChannelProps.parse({ ...data, offset: 0.25 }).offset).toBe(0.25)
})
