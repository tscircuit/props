import { expect, test } from "bun:test"
import { busProps } from "lib/components/bus"

test("bus reference matching keeps the selected endpoint path through a branched clock", () => {
  const props = {
    connections: ["DQ0", "DQ1"],
    lengthMatchTo: "CK",
    skewReference: "references" as const,
    maxLengthSkew: 1,
    lengthMatchingPaths: [[".CPU > .CK", ".RAM > .CK"]],
  }
  expect(busProps.parse(props)).toEqual(props)
})
