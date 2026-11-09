import { expect, test } from "bun:test"
import { toolingrailProps } from "lib/components/toolingrail"
test("tooling rails require a panelSide and positive unit-aware width", () => {
  expect(
    toolingrailProps.parse({ panelSide: "left", width: "5mm" }),
  ).toMatchObject({
    panelSide: "left",
    width: 5,
  })
  for (const width of [0, -5, Infinity])
    expect(
      toolingrailProps.safeParse({ panelSide: "left", width }).success,
    ).toBe(false)
  expect(toolingrailProps.safeParse({ width: 5 }).success).toBe(false)
  expect(
    toolingrailProps.safeParse({ panelSide: "front", width: 5 }).success,
  ).toBe(false)
})
