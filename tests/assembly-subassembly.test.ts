import { expect, test } from "bun:test"
import {
  type AssemblyCadAssemblyPropsInput,
  type AssemblySubassemblyPropsInput,
  assemblyCadAssemblyProps,
  assemblyProps,
  assemblySubassemblyProps,
} from "lib"
import { createElement } from "react"

test("assembly.cadassembly is the same schema as assembly.subassembly", () => {
  expect(assemblyProps.subassembly).toBe(assemblySubassemblyProps)
  expect(assemblyProps.cadassembly).toBe(assemblySubassemblyProps)
  expect(assemblyCadAssemblyProps).toBe(assemblySubassemblyProps)
  const input: AssemblyCadAssemblyPropsInput = {
    name: "display-module",
    displayName: "Display module",
    connectsTo: ".housing",
    cadModel: { glbUrl: "https://example.com/display.glb" },
  }
  const canonical: AssemblySubassemblyPropsInput = input
  expect(assemblyCadAssemblyProps.parse(input)).toEqual(
    assemblySubassemblyProps.parse(canonical),
  )
})

test("keeps selector references and children for core to resolve", () => {
  const children = createElement("assembly.cadassembly", { name: "bracket" })
  const input = { name: "display", connectsTo: ".bracket", children }
  expect(assemblySubassemblyProps.parse(input)).toEqual(input)
  expect(assemblySubassemblyProps.parse(input).children).toBe(children)
  // A forward reference must not require the target to exist during parsing.
  expect(
    assemblyCadAssemblyProps.parse({ name: "bracket", connectsTo: ".housing" }),
  ).toEqual({ name: "bracket", connectsTo: ".housing" })
})

test("permits empty containers and existing CAD model forms without defaults", () => {
  expect(assemblySubassemblyProps.parse({ name: "module" })).toEqual({
    name: "module",
  })
  for (const cadModel of [
    null,
    "soic8",
    { glbUrl: "https://example.com/model.glb" },
  ]) {
    expect(
      assemblySubassemblyProps.parse({ name: "module", cadModel }).cadModel,
    ).toEqual(cadModel)
  }
})

test("rejects missing identities and empty identity or attachment selectors", () => {
  for (const input of [
    {},
    { name: "" },
    { name: "  " },
    { name: "module", connectsTo: " " },
  ]) {
    expect(assemblySubassemblyProps.safeParse(input).success).toBe(false)
    expect(assemblyCadAssemblyProps.safeParse(input).success).toBe(false)
  }
})
