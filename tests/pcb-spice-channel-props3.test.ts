import { expect, test } from "bun:test"
import { channel, parse } from "./fixtures/pcb-spice-channel"

test("PCB SPICE channel validates sections, lanes and refined filaments", () => {
  for (const change of [
    { sections: 0 },
    { sections: 129 },
    { sections: 1.5 },
    { lanes: [] },
    { lanes: Array(4).fill(channel.lanes[0]) },
    { extraction: { ...channel.extraction, filaments: 0 } },
    { extraction: { ...channel.extraction, refinementFilaments: 2 } },
    { extraction: { ...channel.extraction, refinementFilaments: 1.5 } },
  ]) {
    expect(() => parse({ ...channel, ...change })).toThrow()
  }
})
