import { expect, test } from "bun:test"
import { netProps, type NetProps } from "lib/components/net"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse NetProps with connectsTo", () => {
  const raw: NetProps = {
    name: "N1",
    connectsTo: ["U1.1", "U2.2"],
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof netProps>>()

  const parsed = netProps.parse(raw)
  expect(parsed.name).toBe("N1")
  expect(parsed.connectsTo).toEqual(["U1.1", "U2.2"])
})
