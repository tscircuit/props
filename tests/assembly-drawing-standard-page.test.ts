import { expect, test } from "bun:test"
import "bun-match-svg"
import {
  assemblyDrawingProps,
  getAssemblyDrawingPageDimensions,
} from "../lib/assembly/drawing"
test("standard sheet sizes resolve to mm and title blocks validate sheet numbering", async () => {
  expect(assemblyDrawingProps.page.parse({ size: "iso_a4" })).toMatchObject({
    width: 297,
    height: 210,
  })
  expect(
    assemblyDrawingProps.page.parse({
      size: "ansi_a",
      orientation: "portrait",
    }),
  ).toMatchObject({ width: 215.9, height: 279.4 })
  expect(getAssemblyDrawingPageDimensions("ansi_e")).toEqual({
    width: 1117.6,
    height: 863.6,
  })
  for (const page of [
    { size: "iso_a4", width: 297, height: 210 },
    { width: 100 },
    { width: 100, height: 100, orientation: "portrait" },
    { size: "A4" },
  ])
    expect(assemblyDrawingProps.page.safeParse(page).success).toBe(false)
  expect(
    assemblyDrawingProps.titleblock.parse({
      title: "Housing",
      identificationNumber: "H-001",
      sheetNumber: 1,
      numberOfSheets: 2,
    }).identificationNumber,
  ).toBe("H-001")
  expect(
    assemblyDrawingProps.titleblock.safeParse({
      title: "Housing",
      sheetNumber: 3,
      numberOfSheets: 2,
    }).success,
  ).toBe(false)
  const page = assemblyDrawingProps.page.parse({ size: "iso_a4" })
  const block = assemblyDrawingProps.titleblock.parse({
    title: "Housing",
    identificationNumber: "H-001",
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="594" height="420" viewBox="0 0 ${page.width} ${page.height}"><rect width="297" height="210" fill="white"/><rect x="5" y="5" width="287" height="200" fill="none" stroke="black"/><text x="10" y="15" font-size="5">ISO A4 · ${page.width} × ${page.height} mm</text><rect x="112" y="165" width="180" height="40" fill="none" stroke="black"/><text x="115" y="180" font-size="5">${block.title}</text><text x="115" y="195" font-size="4">${block.identificationNumber}</text></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
