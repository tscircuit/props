import { expect, test } from "bun:test"
import {
  voltageProbeProps,
  type VoltageProbeProps,
} from "lib/components/voltageprobe"

test("should parse voltageprobe with name", () => {
  const raw: VoltageProbeProps = {
    connectsTo: "C1.pin1",
    name: "C1_pos",
  }
  const parsed = voltageProbeProps.parse(raw)
  expect(parsed.name).toBe("C1_pos")
  expect(parsed.connectsTo).toBe("C1.pin1")
})

test("should parse voltageprobe without name", () => {
  const raw: VoltageProbeProps = {
    connectsTo: "net.VOUT",
  }
  const parsed = voltageProbeProps.parse(raw)
  expect(parsed.name).toBeUndefined()
  expect(parsed.connectsTo).toBe("net.VOUT")
})
