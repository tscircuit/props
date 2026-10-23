import { expect, test } from "bun:test"
import { channel, parse } from "./fixtures/pcb-spice-channel"

test("PCB SPICE channel parses frequencies in Hz and lengths in mm, including signed return coordinates", () => {
  expect(parse()).toHaveProperty("pcbSpiceChannel", {
    ...channel,
    extraction: {
      ...channel.extraction,
      minimumFrequency: 1,
      maximumFrequency: 1e9,
      modelFrequency: 1e8,
      maxPanelLength: 0.1,
      groundMeshSize: 0.5,
    },
    via: {
      platingThickness: 0.025,
      equivalentWidth: 0.3,
      omitThroughViaStubs: true,
    },
    straightenedStageProfiles: {
      top: {
        spacing: 0.2,
        relativePermittivity: 4,
        return: {
          width: 1,
          thickness: 0.035,
          lengthFactor: 1.1,
          centerY: -0.2,
          centerZ: 0,
        },
      },
    },
  })
})
