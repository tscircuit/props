import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("bus reference matching keeps the selected endpoint path through a branched clock", () => {
  const props = {
    connections: ["DQ0", "DQ1"],
    lengthMatchTo: "CK",
    skewReference: "references",
    maxLengthSkew: 1,
    lengthMatchingPaths: [[".CPU > .CK", ".RAM > .CK"]],
  } satisfies BusProps
  expect(busProps.parse(props)).toEqual(props)
})
