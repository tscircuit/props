import { expect, test } from "bun:test"
import {
  type EnclosureFdmBoxPropsInput,
  enclosureFdmBoxProps,
  enclosureProps,
} from "lib/enclosure"

test("parses enclosure.fdm.Box props with a boardRef", () => {
  const input: EnclosureFdmBoxPropsInput = {
    boardRef: ".main-board",
    width: "45mm",
    height: "35mm",
    depth: "15mm",
    wallThickness: "2.4mm",
  }

  expect(enclosureFdmBoxProps.parse(input)).toEqual({
    boardRef: ".main-board",
    width: 45,
    height: 35,
    depth: 15,
    wallThickness: 2.4,
  })
})

test("exposes the box schema through the enclosure namespace", () => {
  expect(enclosureProps.fdm.Box).toBe(enclosureFdmBoxProps)
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
