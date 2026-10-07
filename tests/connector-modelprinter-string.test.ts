import { expect, test } from "bun:test"
import { connectorProps } from "lib"

test("connector model specifications do not require a standardized interface", () => {
  expect(
    connectorProps.parse({
      name: "J1",
      model: "bullet3_d3.5mm_gmale",
    }),
  ).toMatchObject({ model: "bullet3_d3.5mm_gmale" })
  expect(connectorProps.safeParse({ name: "J1", model: 3.5 }).success).toBe(
    false,
  )
})
