import { expect, test } from "bun:test"
import { currentSourceProps } from "../lib/components/currentsource"

test("current sources retain explicit pulse timing", () => {
  expect(
    currentSourceProps.parse({
      name: "LOAD",
      current: "0.5A",
      peakToPeakCurrent: "0.5A",
      waveShape: "square",
      pulseDelay: "20ms",
      riseTime: "10us",
      fallTime: "10us",
      pulseWidth: "10ms",
      period: "20ms",
    }),
  ).toMatchSnapshot()
})
