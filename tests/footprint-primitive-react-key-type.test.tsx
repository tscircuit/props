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

test("repro: mapped footprint primitives need an awkward key workaround", () => {
  const portHints = ["pin1", "pin2"] as const

  const rejectedSmtPadProps: SmtPadProps = {
    // @ts-expect-error SmtPadProps currently rejects React's reserved key
    key: "pin1",
    shape: "rect",
    width: "1mm",
    height: "2mm",
  }
  const rejectedPlatedHoleProps: PlatedHoleProps = {
    // @ts-expect-error PlatedHoleProps currently rejects React's reserved key
    key: "pin1",
    shape: "circle",
    holeDiameter: "0.8mm",
    outerDiameter: "1.6mm",
  }

  const SmtPadWithKeyWorkaround = (props: SmtPadProps) => <smtpad {...props} />
  const PlatedHoleWithKeyWorkaround = (props: PlatedHoleProps) => (
    <platedhole {...props} />
  )

  const smtPads = portHints.map((portHint, index) => (
    <SmtPadWithKeyWorkaround
      key={portHint}
      shape="rect"
      width="1mm"
      height="2mm"
      pcbX={`${index}mm`}
      portHints={[portHint]}
    />
  ))
  const platedHoles = portHints.map((portHint, index) => (
    <PlatedHoleWithKeyWorkaround
      key={portHint}
      shape="circle"
      holeDiameter="0.8mm"
      outerDiameter="1.6mm"
      pcbX={`${index}mm`}
      portHints={[portHint]}
    />
  ))

  expect(rejectedSmtPadProps).toHaveProperty("key", "pin1")
  expect(rejectedPlatedHoleProps).toHaveProperty("key", "pin1")
  expect(smtPads.map((pad) => pad.key)).toEqual([...portHints])
  expect(platedHoles.map((hole) => hole.key)).toEqual([...portHints])

  const parsedPad = smtPadProps.parse({
    key: "pin1",
    shape: "rect",
    width: "1mm",
    height: "2mm",
  })
  expect("key" in parsedPad).toBe(false)
})
