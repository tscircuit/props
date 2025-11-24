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

test("should parse voltageprobe with color", () => {
  const raw: VoltageProbeProps = {
    connectsTo: "C1.pin1",
    color: "red",
  }
  const parsed = voltageProbeProps.parse(raw)
  expect(parsed.color).toBe("red")
  expect(parsed.connectsTo).toBe("C1.pin1")
})

test("should parse voltageprobe with referenceTo", () => {
  const raw: VoltageProbeProps = {
    connectsTo: ".R1 > .p1",
    referenceTo: ".R1 > .p2",
  }
  const parsed = voltageProbeProps.parse(raw)
  expect(parsed.connectsTo).toBe(".R1 > .p1")
  expect(parsed.referenceTo).toBe(".R1 > .p2")
})

test("should not parse voltageprobe with array connectsTo", () => {
  const raw: any = {
    connectsTo: ["C1.pin1"],
  }
  expect(() => voltageProbeProps.parse(raw)).toThrow()
})
