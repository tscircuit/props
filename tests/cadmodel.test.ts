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
