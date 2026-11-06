import { expect, test } from "bun:test"
import { netProps, type NetProps } from "lib/components/net"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse NetProps with connectsTo", () => {
  const raw: NetProps = {
    name: "N1",
    connectsTo: ["U1.1", "U2.2"],
    routingPhaseIndex: 2,
    highlightColor: "blue",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof netProps>>()

  const parsed = netProps.parse(raw)
  expect(parsed.name).toBe("N1")
  expect(parsed.connectsTo).toEqual(["U1.1", "U2.2"])
  expect(parsed.routingPhaseIndex).toBe(2)
  expect(parsed.highlightColor).toBe("blue")
})

test("should parse NetProps with nullable routingPhaseIndex", () => {
  const raw: NetProps = {
    name: "N2",
    routingPhaseIndex: null,
  }

  const parsed = netProps.parse(raw)
  expect(parsed.routingPhaseIndex).toBeNull()
})

test("should parse NetProps with pcbAllowedLayers", () => {
  const raw: NetProps = {
    name: "RF_OUT",
    pcbAllowedLayers: ["top", "inner2"],
  }

  const parsed = netProps.parse(raw)
  expect(parsed.pcbAllowedLayers).toEqual(["top", "inner2"])
  expect(() =>
    netProps.parse({ name: "RF_OUT", pcbAllowedLayers: [] }),
  ).toThrow()
})
