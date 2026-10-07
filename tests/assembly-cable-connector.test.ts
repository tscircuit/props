import { expect, test } from "bun:test"
import { assemblySubassemblyProps } from "../lib/assembly/subassembly"

test("CAD cable connectors validate mating interfaces and normalize physical lengths", () => {
  const phases = {
    model: "bullet3_d3.5mm_gmale",
    position: { x: "10mm", y: 2, z: "5mm" },
    facingDirection: "x+",
  } as const
  expect(
    assemblySubassemblyProps.parse({
      name: "MOTOR",
      modelUrl: "https://example.com/motor.glb",
      cableConnectors: { phases },
    }).cableConnectors?.phases,
  ).toEqual({ ...phases, position: { x: 10, y: 2, z: 5 } })
  for (const invalid of [
    { ...phases, model: "" },
    { ...phases, model: 3 },
    { ...phases, facingDirection: "front" },
    { ...phases, position: { x: NaN, y: 0, z: 0 } },
  ])
    expect(
      assemblySubassemblyProps.safeParse({
        name: "MOTOR",
        cableConnectors: { phases: invalid },
      }).success,
    ).toBe(false)
})
