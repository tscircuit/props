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

test("validates and normalizes assembly.screen props", () => {
  const parsedScreen = assemblyScreenProps.parse(validScreen)

  expect(parsedScreen).toMatchObject({
    name: "SCREEN",
    connectsTo: ".B1 .J1",
  })
  expect(parsedScreen.width).toBeCloseTo(58.42)
  expect(parsedScreen.height).toBeCloseTo(45.72)

  const cadModel = "flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm"

  expect(assemblyScreenProps.parse({ ...validScreen, cadModel }).cadModel).toBe(
    cadModel,
  )

  for (const field of ["name", "connectsTo", "width", "height"] as const) {
    const invalidScreen = { ...validScreen }
    delete invalidScreen[field]
    expect(() => assemblyScreenProps.parse(invalidScreen)).toThrow()
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
