import { expect, test } from "bun:test"
import { simulationIbisModelProps, type SimulationIbisModelProps } from "../lib"
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

test("IBIS model asset locations match circuit-json rules", () => {
  const base = {
    componentRef: ".U1",
    ibisComponentName: "DRIVER",
    ibisPinNameToPortLabel: { "1": "pin1" },
  } as const
  const withAsset = (url: string, project_relative_path = "models/chip.ibs") =>
    simulationIbisModelProps.safeParse({
      ...base,
      ibisModelAsset: { project_relative_path, url, mimetype: "text/plain" },
    }).success
  expect(withAsset("https://example.com/chip.ibs")).toBe(true)
  expect(withAsset("http://example.com/chip.ibs")).toBe(true)
  expect(withAsset("models/chip.ibs")).toBe(true)
  for (const url of [
    "",
    "javascript:alert(1)",
    "file:///etc/passwd",
    "data:text/plain,x",
    "/etc/passwd",
  ]) {
    expect(withAsset(url)).toBe(false)
  }
  expect(withAsset("https://example.com/chip.ibs", "/abs/chip.ibs")).toBe(false)
})
