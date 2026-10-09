import type { PcbNoiseChannelProps, PcbNoiseEyeProps } from "lib/index"

export const channel: PcbNoiseChannelProps = {
  name: "victim",
  role: "victim",
  source: ".U1 > .V",
  sourceReference: ".U1 > .GND",
  load: ".U2 > .V",
  loadReference: ".U2 > .GND",
  sourceImpedance: "50ohm",
  loadImpedance: "100ohm",
  loadBiasVoltage: "0V",
  waveform: {
    kind: "prbs",
    order: 7,
    baudRate: "500MHz",
    lowVoltage: "0V",
    highVoltage: "1V",
    riseTime: "200ps",
    fallTime: "200ps",
    seed: 1,
  },
}

export const eye: PcbNoiseEyeProps = {
  channel: "victim",
  timing: { kind: "source", channel: "victim", sampleOffset: "1ns" },
}
