import { expect, test } from "bun:test"
import { ibisModelProps, type IbisModelProps } from "../lib"
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
    modelValueCorner: "typical",
    includePackageParasitics: true,
  } satisfies IbisModelProps
  expect(ibisModelProps.parse(model)).toEqual(model)
  for (const change of [
    { modelValueCorner: undefined },
    { ibisModelAsset: { url: model.ibisModelAsset.url } },
    { includePackageParasitics: undefined },
    { ibisPinNameToPortLabel: {} },
  ]) {
    expect(ibisModelProps.safeParse({ ...model, ...change }).success).toBe(
      false,
    )
  }
})
