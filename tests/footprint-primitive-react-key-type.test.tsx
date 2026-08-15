import { expect, test } from "bun:test"
import type { PlatedHoleProps, SmtPadProps } from "lib"
import { smtPadProps } from "lib"

interface TscircuitElements {
  smtpad: SmtPadProps
  platedhole: PlatedHoleProps
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

test("mapped footprint primitives accept React keys directly", () => {
  const portHints = ["pin1", "pin2"] as const

  const keyedSmtPadProps: SmtPadProps = {
    key: "pin1",
    shape: "rect",
    width: "1mm",
    height: "2mm",
  }
  const keyedPlatedHoleProps: PlatedHoleProps = {
    key: "pin1",
    shape: "circle",
    holeDiameter: "0.8mm",
    outerDiameter: "1.6mm",
  }

  const smtPads = portHints.map((portHint, index) => (
    <smtpad
      key={portHint}
      shape="rect"
      width="1mm"
      height="2mm"
      pcbX={`${index}mm`}
      portHints={[portHint]}
    />
  ))
  const platedHoles = portHints.map((portHint, index) => (
    <platedhole
      key={portHint}
      shape="circle"
      holeDiameter="0.8mm"
      outerDiameter="1.6mm"
      pcbX={`${index}mm`}
      portHints={[portHint]}
    />
  ))

  expect(keyedSmtPadProps).toHaveProperty("key", "pin1")
  expect(keyedPlatedHoleProps).toHaveProperty("key", "pin1")
  expect(smtPads.map((pad) => pad.key)).toEqual([...portHints])
  expect(platedHoles.map((hole) => hole.key)).toEqual([...portHints])

  const parsedPad = smtPadProps.parse({
    key: "pin1",
    shape: "rect",
    width: "1mm",
    height: "2mm",
  })
  expect(parsedPad.key).toBe("pin1")
  expect(
    smtPadProps.parse({
      key: 2,
      shape: "rect",
      width: "1mm",
      height: "2mm",
    }).key,
  ).toBe(2)
  expect(
    smtPadProps.parse({
      key: 3n,
      shape: "rect",
      width: "1mm",
      height: "2mm",
    }).key,
  ).toBe(3n)
})
