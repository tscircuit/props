import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  chipProps,
  type ChipProps,
  spicemodelProps,
  type SpicemodelProps,
} from "lib"
import { z } from "zod"

interface TscircuitElements {
  chip: ChipProps
  spicemodel: SpicemodelProps
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends TscircuitElements {}
  }
}
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends TscircuitElements {}
  }
}

test("spicemodel props parse source and spice pin mapping", () => {
  const raw: SpicemodelProps = {
    source: ".subckt LM358 OUT IN- IN+ V- V+\n.ends LM358",
    spicePinMapping: {
      OUT: "OUT",
      "IN-": "IN-",
      "IN+": "IN+",
      "V-": "V-",
      "V+": "V+",
    },
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof spicemodelProps>>()
  expect(spicemodelProps.parse(raw)).toEqual(raw)
})

test("chip spiceModel accepts a spicemodel element", () => {
  const raw: ChipProps = {
    name: "U1",
    spiceModel: (
      <spicemodel source=".subckt LM358 OUT IN- IN+ V- V+\n.ends LM358" />
    ),
  }

  expect(chipProps.parse(raw).spiceModel).toBe(raw.spiceModel)
})

test("chip spiceModel rejects plain model objects", () => {
  expect(() => {
    chipProps.parse({
      name: "U1",
      spiceModel: {
        source: ".subckt LM358 OUT IN- IN+ V- V+\n.ends LM358",
      },
    })
  }).toThrow(z.ZodError)
})
