import { expect, test } from "bun:test"
import {
  cadmodelProps,
  type CadModelPropsInput,
} from "../lib/components/cadmodel"

test("cadmodel accepts pcb coordinates", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    pcbX: 1,
    pcbY: 2,
    pcbZ: 3,
  }
  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >
  expect(parsed.pcbX).toBe(1)
  expect(parsed.pcbY).toBe(2)
  expect(parsed.pcbZ).toBe(3)
})

test("cadmodel accepts calc pcb coordinates", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    pcbX: "calc(1cm + 1mm)",
    pcbY: "calc(5 - 2)",
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.pcbX).toBe("calc(1cm + 1mm)")
  expect(parsed.pcbY).toBe("calc(5 - 2)")
})

test("cadmodel accepts pcb edge coordinates", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    pcbLeftEdgeX: "1cm",
    pcbRightEdgeX: 5,
    pcbTopEdgeY: "3mm",
    pcbBottomEdgeY: -2,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.pcbLeftEdgeX).toBe(10)
  expect(parsed.pcbRightEdgeX).toBe(5)
  expect(parsed.pcbTopEdgeY).toBe(3)
  expect(parsed.pcbBottomEdgeY).toBe(-2)
})

test("cadmodel accepts pcb offsets", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    pcbOffsetX: "1mm",
    pcbOffsetY: 2,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.pcbOffsetX).toBeCloseTo(1)
  expect(parsed.pcbOffsetY).toBe(2)
})

test("cadmodel accepts optional stepUrl", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    stepUrl: "https://example.com/model.step",
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.stepUrl).toBe("https://example.com/model.step")
})

test("cadmodel accepts zOffsetFromSurface", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    zOffsetFromSurface: 0,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.zOffsetFromSurface).toBe(0)
})

test("cadmodel accepts showAsTranslucentModel", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    showAsTranslucentModel: true,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.showAsTranslucentModel).toBe(true)
})

test("cadmodel accepts modelBoardNormalDirection and pcbRotationOffset", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    modelBoardNormalDirection: "z+",
    pcbRotationOffset: 90,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.modelBoardNormalDirection).toBe("z+")
  expect(parsed.pcbRotationOffset).toBe(90)
})

test("cadmodel model strings resolve to the canonical modelUrl props", () => {
  for (const model of [
    "soic8",
    "pinrow4_p2.54mm",
    "flexscreen_w16_h10_flex5_sitsflat",
    "soic8_bodyWidth=4",
  ]) {
    const transforms = {
      pcbX: "1cm",
      pcbZ: 4,
      rotationOffset: { x: 0, y: 0, z: 90 },
      modelUnitToMmScale: 1,
      stepUrl: "/part.step",
      showAsTranslucentModel: true,
    }
    const raw: CadModelPropsInput = { model: `  ${model}  `, ...transforms }
    expect(cadmodelProps.parse(raw)).toEqual(
      cadmodelProps.parse({
        modelUrl: `https://modelcdn.tscircuit.com/jscad_models/${encodeURIComponent(model)}.glb`,
        ...transforms,
      }),
    )
    expect(raw.model).toBe(`  ${model}  `)
  }
})

test("cadmodel model URLs preserve imported geometry and transforms", () => {
  for (const model of [
    "https://example.com/part.glb",
    "http://example.com/part.step#ext=step",
  ]) {
    expect(cadmodelProps.parse({ model, pcbZ: 4 })).toEqual(
      cadmodelProps.parse({ modelUrl: model, pcbZ: 4 }),
    )
  }
})

test("cadmodel rejects missing, invalid, or conflicting model sources", () => {
  for (const raw of [
    {},
    { stepUrl: "/part.step" },
    { model: "" },
    { model: "  " },
    { model: null },
    { model: 123 },
    { model: "soic8", modelUrl: "/part.glb" },
  ]) {
    expect(cadmodelProps.safeParse(raw).success).toBe(false)
  }
})

test("cadmodel preserves legacy URL and null inputs", () => {
  expect(cadmodelProps.parse(null)).toBeNull()
  expect(cadmodelProps.parse("/part.glb")).toBe("/part.glb")
  expect(cadmodelProps.parse({ modelUrl: { default: "/part.glb" } })).toEqual({
    modelUrl: "/part.glb",
  })
})
