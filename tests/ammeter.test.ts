import { expect, test } from "bun:test"
import { ammeterProps, type AmmeterProps } from "lib/components/ammeter"
import { z } from "zod"

test("should parse ammeter with pos and neg connections", () => {
  const raw: AmmeterProps = {
    name: "A1",
    connections: {
      pos: ".R1 > .pin1",
      neg: ".R1 > .pin2",
    },
  }

  const parsed = ammeterProps.parse(raw)
  expect(parsed.name).toBe("A1")
  expect(parsed.connections).toEqual({
    pos: ".R1 > .pin1",
    neg: ".R1 > .pin2",
  })
})

test("should parse ammeter with pin1 and pin2 connections", () => {
  const raw: AmmeterProps = {
    name: "A2",
    connections: {
      pin1: ".R2 > .pin1",
      pin2: ".R2 > .pin2",
    },
  }

  const parsed = ammeterProps.parse(raw)
  expect(parsed.connections).toEqual({
    pin1: ".R2 > .pin1",
    pin2: ".R2 > .pin2",
  })
})

test("should parse ammeter with color and display props", () => {
  const raw: AmmeterProps = {
    name: "A3",
    color: "green",
    connections: {
      pos: "net.IN",
      neg: "net.OUT",
    },
    graphDisplayName: "I_LOAD",
    graphCenter: 0,
    graphOffsetDivs: 2,
    graphUnitsPerDiv: 0.01,
  }

  const parsed = ammeterProps.parse(raw)
  expect(parsed.color).toBe("green")
  expect(parsed.graphDisplayName).toBe("I_LOAD")
  expect(parsed.graphCenter).toBe(0)
  expect(parsed.graphOffsetDivs).toBe(2)
  expect(parsed.graphUnitsPerDiv).toBe(0.01)
})

test("should reject missing ammeter connections", () => {
  expect(() => {
    ammeterProps.parse({
      name: "A_missing",
    })
  }).toThrow(z.ZodError)
})

test("should reject incomplete ammeter connection pairs", () => {
  expect(() => {
    ammeterProps.parse({
      name: "A_incomplete",
      connections: {
        pos: "net.IN",
      },
    })
  }).toThrow(z.ZodError)
})

test("should reject ammeter connections with invalid keys", () => {
  expect(() => {
    ammeterProps.parse({
      name: "A_invalid",
      connections: {
        left: "net.IN",
        right: "net.OUT",
      },
    })
  }).toThrow(z.ZodError)
})
