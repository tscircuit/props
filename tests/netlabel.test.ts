import { expect, test } from "bun:test"
import { netLabelProps, type NetLabelProps } from "lib/components/netlabel"
import { z } from "zod"

test("rejects net and connection provided together", () => {
  const result = netLabelProps.safeParse({
    net: "DC_IN",
    connection: "net.A",
  } satisfies NetLabelProps)

  expect(result.success).toBe(false)
  if (result.success) return

  expect(result.error).toBeInstanceOf(z.ZodError)
  expect(result.error.issues).toContainEqual({
    code: "custom",
    message: "net and connection cannot be provided together",
    path: ["connection"],
  })
})

test("accepts net with connectsTo", () => {
  const parsed = netLabelProps.parse({
    net: "DC_IN",
    connectsTo: "U1.pin1",
  } satisfies NetLabelProps)

  expect(parsed).toEqual({
    net: "DC_IN",
    connectsTo: "U1.pin1",
  })
})

test("continues to parse legacy connection when net is absent", () => {
  const parsed = netLabelProps.parse({
    connection: "U1.pin1",
  } satisfies NetLabelProps)

  expect(parsed).toEqual({
    connection: "U1.pin1",
  })
})
