import { expect, test } from "bun:test"
import {
  type AssemblyScreenPropsInput,
  assemblyProps,
  assemblyScreenProps,
} from "lib/assembly"

const validScreen: AssemblyScreenPropsInput = {
  name: "SCREEN",
  connectsTo: ".B1 .J1",
  width: "2.3in",
  height: "1.8in",
}

const cadModel = "flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm"

const cadModelOnlyScreen: AssemblyScreenPropsInput = {
  name: "SCREEN",
  connectsTo: ".B1 .J1",
  cadModel,
}

test("validates and normalizes assembly.screen props", () => {
  const parsedScreen = assemblyScreenProps.parse(validScreen)

  expect(parsedScreen).toMatchObject({
    name: "SCREEN",
    connectsTo: ".B1 .J1",
  })
  expect(parsedScreen.width).toBeCloseTo(58.42)
  expect(parsedScreen.height).toBeCloseTo(45.72)

  const parsedCadModelOnlyScreen = assemblyScreenProps.parse(cadModelOnlyScreen)
  expect(parsedCadModelOnlyScreen).toMatchObject({
    name: "SCREEN",
    connectsTo: ".B1 .J1",
    cadModel,
  })
  expect(parsedCadModelOnlyScreen.width).toBeUndefined()
  expect(parsedCadModelOnlyScreen.height).toBeUndefined()
  expect(assemblyScreenProps.parse({ ...validScreen, cadModel }).cadModel).toBe(
    cadModel,
  )

  for (const field of ["name", "connectsTo"] as const) {
    const invalidScreen = { ...validScreen }
    delete invalidScreen[field]
    expect(() => assemblyScreenProps.parse(invalidScreen)).toThrow()
  }

  expect(() =>
    assemblyScreenProps.parse({
      name: "SCREEN",
      connectsTo: ".B1 .J1",
    }),
  ).toThrow("provide either width and height or cadModel")

  for (const partialDimensions of [
    { width: "40mm" },
    { height: "22.5mm" },
    { width: "40mm", cadModel },
    { height: "22.5mm", cadModel },
  ]) {
    expect(() =>
      assemblyScreenProps.parse({
        name: "SCREEN",
        connectsTo: ".B1 .J1",
        ...partialDimensions,
      }),
    ).toThrow("width and height must be provided together")
  }

  for (const field of ["name", "connectsTo", "cadModel"] as const) {
    expect(() =>
      assemblyScreenProps.parse({ ...validScreen, [field]: "   " }),
    ).toThrow(`${field} cannot be empty`)
  }

  for (const [field, value] of [
    ["width", 0],
    ["width", "-1mm"],
    ["height", Number.POSITIVE_INFINITY],
    ["height", "not-a-distance"],
  ] as const) {
    expect(() =>
      assemblyScreenProps.parse({ ...validScreen, [field]: value }),
    ).toThrow()
  }

  expect(assemblyProps.screen).toBe(assemblyScreenProps)
})
