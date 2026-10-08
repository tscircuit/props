import { expect, test } from "bun:test"
import { assemblyPartProps, assemblyPrintedPartProps } from "lib"
import { createElement } from "react"

test("parts preserve reference-surface children and printed parts accept a color", () => {
  const children = createElement("assembly.referencesurface", {
    name: "board",
    zOffset: "1mm",
  })
  expect(assemblyPartProps.parse({ name: "part", children }).children).toBe(
    children,
  )
  expect(
    assemblyPrintedPartProps.parse({
      name: "print",
      model: "soic8",
      children,
      color: " #ff8800 ",
    }),
  ).toMatchObject({ children, color: "#ff8800" })
  expect(
    assemblyPrintedPartProps.safeParse({
      name: "print",
      model: "soic8",
      color: " ",
    }).success,
  ).toBe(false)
})

test("printed parts accept only supported materials without selecting a default", () => {
  for (const material of ["pla", "petg", "nylon"] as const)
    expect(
      assemblyPrintedPartProps.parse({ name: "part", model: "soic8", material })
        .material,
    ).toBe(material)
  expect(
    assemblyPrintedPartProps.parse({ name: "part", model: "soic8" }),
  ).not.toHaveProperty("material")
  expect(
    assemblyPrintedPartProps.safeParse({
      name: "part",
      model: "soic8",
      material: "abs",
    }).success,
  ).toBe(false)
})
