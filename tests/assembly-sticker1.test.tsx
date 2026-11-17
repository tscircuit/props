import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  assemblyPrintedPartProps,
  assemblyProps,
  assemblyStickerProps,
  type AssemblyStickerProps,
  type AssemblyStickerPropsInput,
} from "../lib"

const Lid = () => null
// Props supplies validators; core supplies the namespaced JSX components.
const assembly = {
  sticker: (props: AssemblyStickerPropsInput) =>
    createElement("assembly.sticker", props),
}

test("sticker parses artwork, size, BOM and placement on a surface of its parent part", () => {
  const input = {
    name: "LABEL",
    displayName: "Product label",
    imageUrl: "./label.svg",
    surfaceRef: "topSurface",
    width: "30mm",
    height: 16,
    thickness: "0.1mm",
    backgroundColor: " #ffffff ",
    distanceFromSurfaceLeftEdge: "6mm",
    yOffsetFromSurfaceCenter: -1,
    rotationOnSurface: "90deg cw",
    purchaseUrls: ["https://store.example/labels"],
  } satisfies AssemblyStickerProps

  expect(assemblyProps.sticker).toBe(assemblyStickerProps)
  expect(assemblyStickerProps.parse(input)).toEqual({
    name: "LABEL",
    displayName: "Product label",
    imageUrl: "./label.svg",
    surfaceRef: "topSurface",
    width: 30,
    height: 16,
    thickness: 0.1,
    backgroundColor: "#ffffff",
    distanceFromSurfaceLeftEdge: 6,
    yOffsetFromSurfaceCenter: -1,
    anchorAlignment: "center",
    rotationOnSurface: -90,
    purchaseUrls: ["https://store.example/labels"],
  })

  // Static-file imports resolve through their default export.
  expect(
    assemblyStickerProps.parse({
      name: "LOGO",
      imageUrl: { default: "/assets/logo.png" },
      surfaceRef: "badge",
      width: 10,
    }).imageUrl,
  ).toBe("/assets/logo.png")

  const children = <assembly.sticker {...input} />
  expect(
    assemblyPrintedPartProps.parse({ name: "LID", jscad: <Lid />, children })
      .children,
  ).toBe(children)
  expect(assemblyStickerProps.parse(children.props)).toMatchObject({
    name: "LABEL",
    width: 30,
  })
})
