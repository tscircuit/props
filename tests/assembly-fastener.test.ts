import { expect, test } from "bun:test"
import {
  type AssemblyFastenerProps,
  type AssemblyFastenerPropsInput,
  assemblyFastenerProps,
  assemblyProps,
} from "lib"
import { createElement } from "react"

test("exports a fastener with no geometry or mounting defaults", () => {
  expect(assemblyProps.fastener).toBe(assemblyFastenerProps)
  const input: AssemblyFastenerProps = { name: "clip" }
  const props: AssemblyFastenerPropsInput = input
  expect(assemblyFastenerProps.parse(props)).toEqual({ name: "clip" })
})

test("canonicalizes fastening aliases and unit-aware mounting without a mountFace", () => {
  const input: AssemblyFastenerProps = {
    name: " screw ",
    displayName: "Cover screw",
    fastenedTo: " DEVICE.FRAME.boltHole ",
    mountGap: "1cm",
    model: " screw_m3_10mm ",
  }
  expect(assemblyFastenerProps.parse(input)).toEqual({
    name: "screw",
    displayName: "Cover screw",
    mountedTo: "DEVICE.FRAME.boltHole",
    mountGap: 10,
    model: "screw_m3_10mm",
  })
  expect(
    assemblyFastenerProps.parse({
      name: "clip",
      mountedTo: "FRAME.top",
      fastenedTo: " FRAME.top ",
      mountFace: " underside ",
      mountGap: 0,
    }),
  ).toEqual({
    name: "clip",
    mountedTo: "FRAME.top",
    mountFace: "underside",
    mountGap: 0,
  })
})

test("preserves existing CAD sources and reference children", () => {
  const child = createElement("referencesurface", { name: "underside" })
  for (const source of [
    { model: "clip" },
    { modelUrl: { default: "clip.stl" } },
    { cadModel: { glbUrl: "clip.glb" } },
    { cadModel: null },
    { cadModel: createElement("cuboid", { size: [1, 2, 3] }) },
  ]) {
    const result = assemblyFastenerProps.parse({
      name: "clip",
      ...source,
      children: child,
    })
    expect(result.children).toBe(child)
    if ("modelUrl" in source) expect(result.modelUrl).toBe("clip.stl")
    if ("cadModel" in source) expect(result.cadModel).toEqual(source.cadModel)
  }
})

test("rejects invalid mounting, alias conflicts and invalid model sources", () => {
  for (const props of [
    { name: " " },
    { mountedTo: "FRAME" },
    { fastenedTo: " " },
    { mountedTo: "FRAME..top" },
    { mountedTo: ".top" },
    { mountedTo: "FRAME.top", fastenedTo: "FRAME.bottom" },
    { mountFace: "underside" },
    { mountGap: 0 },
    { mountedTo: "FRAME.top", mountFace: " " },
    { mountedTo: "FRAME.top", mountGap: "-1mm" },
    { mountedTo: "FRAME.top", mountGap: Number.NaN },
    { mountedTo: "FRAME.top", mountGap: Number.POSITIVE_INFINITY },
    { model: " " },
    { modelUrl: " " },
    { model: "clip", cadModel: null },
    { model: "clip", modelUrl: "clip.stl" },
    { modelUrl: "clip.stl", cadModel: { stlUrl: "clip.stl" } },
  ]) {
    expect(
      assemblyFastenerProps.safeParse({ name: "clip", ...props }).success,
    ).toBe(false)
  }
})
