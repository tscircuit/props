import { expect, test } from "bun:test"
import { type SimulationIbisModelProps, simulationIbisModelProps } from "../lib"
test("IBIS models use a shared asset and explicit vendor pin bindings", () => {
  const model = {
    componentRef: ".U1",
    ibisModelAsset: {
      project_relative_path: "models/chip.ibs",
      url: "https://example.com/chip.ibs",
      mimetype: "text/plain",
    },
    ibisComponentName: "DRIVER",
    ibisPinNameToPortLabel: { "1": "pin1" },
  } satisfies SimulationIbisModelProps
  expect(simulationIbisModelProps.parse(model)).toEqual(model)
  for (const removed of [
    { modelValueCorner: "typical" },
    { includePackageParasitics: true },
  ]) {
    expect(
      simulationIbisModelProps.safeParse({ ...model, ...removed }).success,
    ).toBe(false)
  }
  for (const change of [
    { ibisModelAsset: { url: model.ibisModelAsset.url } },
    { ibisPinNameToPortLabel: {} },
  ]) {
    expect(
      simulationIbisModelProps.safeParse({ ...model, ...change }).success,
    ).toBe(false)
  }
})
