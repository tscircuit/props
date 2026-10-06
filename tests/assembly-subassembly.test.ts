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
    cadModel: { glbUrl: "https://example.com/display.glb" },
  }
  const canonical: AssemblySubassemblyPropsInput = input
  expect(assemblyCadAssemblyProps.parse(input)).toEqual(
    assemblySubassemblyProps.parse(canonical),
  )
})

test("preserves nested children", () => {
  const children = createElement("assembly.cadassembly", { name: "bracket" })
  const input = { name: "display", children }
  expect(assemblySubassemblyProps.parse(input)).toEqual(input)
  expect(assemblySubassemblyProps.parse(input).children).toBe(children)
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

test("rejects missing and empty identities", () => {
  for (const input of [{}, { name: "" }, { name: "  " }]) {
    expect(assemblySubassemblyProps.safeParse(input).success).toBe(false)
    expect(assemblyCadAssemblyProps.safeParse(input).success).toBe(false)
  }
})

test("connectsTo is not a subassembly prop on either alias", () => {
  for (const schema of [assemblySubassemblyProps, assemblyCadAssemblyProps]) {
    expect(schema.parse({ name: "module", connectsTo: ".other" })).toEqual({
      name: "module",
    })
  }
  const input: AssemblySubassemblyPropsInput = {
    name: "module",
    // @ts-expect-error Subassemblies group geometry; they do not attach to targets.
    connectsTo: ".other",
  }
  expect(input.name).toBe("module")
})
