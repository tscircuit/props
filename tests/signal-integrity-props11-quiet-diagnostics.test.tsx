import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("bare quiet and boolean quiet report the RFC diagnostic", () => {
  // @ts-expect-error A bare quiet attribute is boolean, not a level.
  const bare = <simulation.pcbchannel {...data} quiet />
  for (const props of [
    bare.props,
    { ...data, quiet: true },
    { ...data, quiet: false },
  ]) {
    const parsed = pcbChannelProps.safeParse(props)
    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      expect(parsed.error.issues).toEqual([
        expect.objectContaining({
          path: ["quiet"],
          message: 'quiet needs a level: "low", "high" or "off".',
        }),
      ])
    }
  }
})
