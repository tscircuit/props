import { expect, test } from "bun:test"
import { switchProps, type SwitchProps } from "../lib/components/switch"

test("should parse switch props with type value", () => {
  const rawProps: SwitchProps = {
    name: "transistor",
    type: "dpst",
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.type).toBe("dpst")
})

test("should parse switch props with flag value", () => {
  const rawProps: SwitchProps = {
    name: "transistor",
    dpst: true,
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.dpst).toBe(true)
})

test("should fail to parse switch props with invalid switch type", () => {
  const rawProps = {
    name: "transistor",
    dpst: false,
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.dpst).toBe(false)
})

test("should parse switch props with connections", () => {
  const rawProps: SwitchProps = {
    name: "switch",
    connections: {
      pin1: ".U1 > .pin1",
    },
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.connections?.pin1).toBe(".U1 > .pin1")
})

test("should parse switch props with noConnect pins", () => {
  const rawProps: SwitchProps = {
    name: "switch",
    type: "spdt",
    noConnect: ["pin3"],
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.noConnect).toEqual(["pin3"])
})

test.each(["spst", "spdt", "dpst", "dpdt"] as const)(
  "%s preserves readonly noConnect aliases with either type syntax",
  (type) => {
    const noConnect = ["UNUSED"] as const
    const rawProps: SwitchProps = {
      name: "SW1",
      type,
      pinLabels: { pin1: "UNUSED" },
      noConnect,
    }
    expect(switchProps.parse(rawProps).noConnect).toEqual(["UNUSED"])
    expect(
      switchProps.parse({ name: "SW1", [type]: true, noConnect }).noConnect,
    ).toEqual(["UNUSED"])
  },
)

test("noConnect is optional and accepts an empty array", () => {
  expect(
    switchProps.parse({ name: "SW1", type: "spdt" }).noConnect,
  ).toBeUndefined()
  expect(switchProps.parse({ name: "SW1", noConnect: [] }).noConnect).toEqual(
    [],
  )
})

test.each(["pin3", [3], ["invalid label"], [""]])(
  "rejects invalid noConnect input %j",
  (noConnect) => {
    expect(switchProps.safeParse({ name: "SW1", noConnect }).success).toBe(
      false,
    )
  },
)
