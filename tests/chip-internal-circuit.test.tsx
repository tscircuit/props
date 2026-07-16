import { expect, test } from "bun:test"
import { chipProps, type ChipProps, type MosfetProps } from "lib"
import { z } from "zod"

interface TscircuitElements {
  chip: ChipProps
  mosfet: MosfetProps
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

test("chip internalCircuit accepts a fragment of functional components", () => {
  const internalCircuit = (
    <>
      <mosfet
        name="A"
        channelType="n"
        mosfetMode="enhancement"
        connections={{
          gate: "pin.G1",
          source: "pin.S1",
          drain: "pin.D1",
        }}
      />
      <mosfet
        name="B"
        channelType="n"
        mosfetMode="enhancement"
        connections={{
          gate: "pin.G2",
          source: "pin.S2",
          drain: "pin.D2",
        }}
      />
    </>
  )
  const raw: ChipProps = {
    name: "Q1",
    internalCircuit,
  }

  expect(chipProps.parse(raw).internalCircuit).toBe(internalCircuit)
})

test("chip internalCircuit rejects objects that are not React elements", () => {
  expect(() =>
    chipProps.parse({
      name: "Q1",
      internalCircuit: {
        type: "mosfet",
        props: {},
      },
    }),
  ).toThrow(z.ZodError)
})
