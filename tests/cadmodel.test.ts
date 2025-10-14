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

test("cadmodel accepts modelUnitToMmScale", () => {
  const raw: CadModelPropsInput = {
    modelUrl: "https://example.com/model.stl",
    modelUnitToMmScale: 2,
  }

  const parsed = cadmodelProps.parse(raw) as Exclude<
    CadModelPropsInput,
    null | string
  >

  expect(parsed.modelUnitToMmScale).toBe(2)
})
