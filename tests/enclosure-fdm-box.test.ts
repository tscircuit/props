import { expect, test } from "bun:test"
import {
  type EnclosureFdmBoxPropsInput,
  enclosureFdmBoxProps,
  enclosureProps,
} from "lib/enclosure"

test("parses enclosure.fdm.box props with a boardRef", () => {
  const input: EnclosureFdmBoxPropsInput = {
    name: "EN1",
    boardRef: ".main-board",
    width: "45mm",
    height: "35mm",
    depth: "15mm",
    wallThickness: "2.4mm",
    floorThickness: "2.2mm",
    lidThickness: "1.8mm",
    boardClearance: "0.8mm",
    standoffHeight: "4mm",
    topHeadroom: "6mm",
    lidLipDepth: "3mm",
    disableCutouts: true,
  }

  expect(enclosureFdmBoxProps.parse(input)).toEqual({
    name: "EN1",
    boardRef: ".main-board",
    width: 45,
    height: 35,
    depth: 15,
    wallThickness: 2.4,
    floorThickness: 2.2,
    lidThickness: 1.8,
    boardClearance: 0.8,
    standoffHeight: 4,
    topHeadroom: 6,
    lidLipDepth: 3,
    disableCutouts: true,
  })
})

test("exposes the box schema through the enclosure namespace", () => {
  expect(enclosureProps.fdm.box).toBe(enclosureFdmBoxProps)
})

test("allows dimensions to be inferred from boardRef", () => {
  expect(
    enclosureFdmBoxProps.parse({
      boardRef: ".main-board",
    }),
  ).toEqual({
    boardRef: ".main-board",
    wallThickness: 2,
  })
})

test("requires a non-empty boardRef", () => {
  expect(() =>
    enclosureFdmBoxProps.parse({
      boardRef: "",
      width: 45,
      height: 35,
      depth: 15,
    }),
  ).toThrow()
})

test("defaults wallThickness to 2mm", () => {
  expect(
    enclosureFdmBoxProps.parse({
      boardRef: ".main-board",
      width: 45,
      height: 35,
      depth: 15,
    }).wallThickness,
  ).toBe(2)
})
