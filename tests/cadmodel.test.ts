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
  const parsed = cadmodelProps.parse(raw)
  expect(parsed.pcbX).toBe(1)
  expect(parsed.pcbY).toBe(2)
  expect(parsed.pcbZ).toBe(3)
})
