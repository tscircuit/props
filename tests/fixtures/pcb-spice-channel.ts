import { analogTransientSimulationProps } from "../../lib"

export const channel = {
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

export const parse = (pcbSpiceChannel: unknown = channel) =>
  analogTransientSimulationProps.parse({
    spiceEngine: "pcb_spice",
    pcbSpiceChannel,
  })
