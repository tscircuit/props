import { expect, test } from "bun:test"
import { cadassemblyProps } from "lib/components/cadassembly"

test("leaves originalLayer undefined when omitted", () => {
  expect(cadassemblyProps.parse({}).originalLayer).toBeUndefined()
})
