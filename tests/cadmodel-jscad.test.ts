import { expect, test } from "bun:test"
import {
  cadmodelProps,
  type CadModelPropsInput,
} from "../lib/components/cadmodel"

test("cadmodel accepts JSCAD operations", () => {
  const cadModelProps: CadModelPropsInput = {
    jscad: {
      type: "colorize",
      color: [1, 0, 0],
      shape: { type: "cuboid", size: [2, 3, 4] },
    },
    pcbX: 5,
    pcbY: 6,
    pcbZ: 1,
  }

  expect(cadmodelProps.parse(cadModelProps)).toEqual({
    jscad: {
      type: "colorize",
      color: [1, 0, 0],
      shape: { type: "cuboid", size: [2, 3, 4] },
    },
    pcbX: 5,
    pcbY: 6,
    pcbZ: 1,
  })
})
