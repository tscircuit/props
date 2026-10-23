import { expect, test } from "bun:test"
import { analogTransientSimulationProps, ibisModelAsset } from "../lib"

const channel = {
  reduction: "straightened-stages",
  sections: 8,
  lanes: [{ name: "DQ0", from: ".U1 > .DATA", to: ".U2 > .DATA" }],
  referencePinRef: ".U1 > .GND",
  passiveComponentRefs: [".RTERM"],
  extraction: {
    minimumFrequency: "1Hz",
    maximumFrequency: "1GHz",
    modelFrequency: "100MHz",
    filaments: 2,
    refinementFilaments: 4,
    convergenceTolerance: 0.01,
    capacitanceTolerance: 0.02,
    reciprocityTolerance: 0.03,
    dcResistanceTolerance: 0.04,
    maxPanelLength: "0.1mm",
    groundMeshSize: "0.5mm",
  },
  relativePermittivity: 4.2,
  via: {
    platingThickness: "25um",
    equivalentWidth: "0.3mm",
    omitThroughViaStubs: true,
  },
  straightenedStageProfiles: {
    top: {
      spacing: "0.2mm",
      relativePermittivity: 4,
      return: {
        width: "1mm",
        thickness: "35um",
        lengthFactor: 1.1,
        centerY: "-0.2mm",
        centerZ: 0,
      },
    },
  },
}

const parse = (pcbSpiceChannel: unknown = channel) =>
  analogTransientSimulationProps.parse({
    spiceEngine: "pcb_spice",
    pcbSpiceChannel,
  })

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

test("PCB SPICE channel requires the PCB SPICE engine", () => {
  for (const spiceEngine of [undefined, "spicey", "ngspice"]) {
    const result = analogTransientSimulationProps.safeParse({
      spiceEngine,
      pcbSpiceChannel: channel,
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(
        result.error.issues.some(
          (issue) => issue.path[0] === "pcbSpiceChannel",
        ),
      ).toBe(true)
  }
})

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

test("IBIS model asset accepts an optional case-insensitive SHA-256 digest", () => {
  const asset = {
    project_relative_path: "models/chip.ibs",
    url: "models/chip.ibs",
    mimetype: "text/plain",
  }
  const sha256 = "Ab01".repeat(16)
  expect(ibisModelAsset.parse({ ...asset, sha256 })).toEqual({
    ...asset,
    sha256,
  })
  expect(ibisModelAsset.parse(asset)).toEqual(asset)
  for (const sha256 of ["a".repeat(63), "a".repeat(65), "z".repeat(64)]) {
    expect(() => ibisModelAsset.parse({ ...asset, sha256 })).toThrow()
  }
})
