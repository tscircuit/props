import { expect, test } from "bun:test"
import {
  type AssemblyPartProps,
  type AssemblyPartPropsInput,
  assemblyPartProps,
  assemblyProps,
} from "lib"
import { createElement } from "react"

test("exports a generic assembly part with no geometry defaults", () => {
  expect(assemblyProps.part).toBe(assemblyPartProps)
  const input: AssemblyPartProps = { name: "bracket" }
  const props: AssemblyPartPropsInput = input
  expect(assemblyProps.part.parse(props)).toEqual({ name: "bracket" })
})

test("normalizes identity and model strings and preserves displayName", () => {
  expect(
    assemblyPartProps.parse({
      name: " bracket ",
      displayName: "Mounting bracket",
      model: " bracket(width=10mm) ",
    }),
  ).toEqual({
    name: "bracket",
    displayName: "Mounting bracket",
    model: "bracket(width=10mm)",
  })
})

test("accepts model URLs including asset imports", () => {
  const modelUrl = "https://example.com/bracket.step"
  expect(assemblyPartProps.parse({ name: "bracket", modelUrl })).toEqual({
    name: "bracket",
    modelUrl,
  })
  expect(
    assemblyPartProps.parse({
      name: "bracket",
      modelUrl: { default: modelUrl },
    }),
  ).toEqual({ name: "bracket", modelUrl })
})

test("accepts the existing CAD model formats", () => {
  for (const cadModel of [
    null,
    "soic8",
    { glbUrl: "https://example.com/part.glb" },
    { stlUrl: "https://example.com/part.stl" },
    { stepUrl: "https://example.com/part.step" },
    createElement("cuboid", { size: [10, 10, 10] }),
  ]) {
    expect(
      assemblyPartProps.parse({ name: "part", cadModel }).cadModel,
    ).toEqual(cadModel)
  }
})

test("rejects missing or empty identity and empty model sources", () => {
  for (const input of [
    {},
    { name: "" },
    { name: "  " },
    { name: "part", model: " " },
    { name: "part", modelUrl: " " },
    { name: "part", cadModel: "" },
    { name: "part", cadModel: {} },
  ]) {
    expect(assemblyPartProps.safeParse(input).success).toBe(false)
  }
})

test("rejects conflicting model sources, including explicit null CAD geometry", () => {
  for (const sources of [
    { model: "soic8", modelUrl: "part.stl" },
    { model: "soic8", cadModel: "soic8" },
    { modelUrl: "part.stl", cadModel: { stlUrl: "part.stl" } },
    { model: "soic8", modelUrl: "part.stl", cadModel: "soic8" },
    { model: "soic8", cadModel: null },
  ]) {
    expect(
      assemblyPartProps.safeParse({ name: "part", ...sources }).success,
    ).toBe(false)
  }
})
