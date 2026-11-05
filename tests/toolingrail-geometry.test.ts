import { expect, test } from "bun:test"
import { toolingrailProps } from "lib/components/toolingrail"
test("tooling rails require a side and positive unit-aware width", () => {
  expect(toolingrailProps.parse({ side: "left", width: "5mm" })).toMatchObject({
    side: "left",
    width: 5,
  })
  for (const width of [0, -5, Infinity])
    expect(toolingrailProps.safeParse({ side: "left", width }).success).toBe(
      false,
    )
  expect(toolingrailProps.safeParse({ width: 5 }).success).toBe(false)
  expect(toolingrailProps.safeParse({ side: "front", width: 5 }).success).toBe(
    false,
  )
})
