import { expect, test } from "bun:test"
import { assemblySubassemblyProps } from "../lib/assembly/subassembly"

test("CAD cable connectors validate mating interfaces and normalize physical lengths", () => {
  const phases = {
    standard: "bullet",
    bulletDiameter: "3.5mm",
    bulletGender: "male",
    pinCount: 3,
    position: { x: "10mm", y: 2, z: "5mm" },
    facingDirection: "x+",
  }
  expect(
    assemblySubassemblyProps.parse({
      name: "MOTOR",
      modelUrl: "https://example.com/motor.glb",
      cableConnectors: { phases },
    }).cableConnectors?.phases,
  ).toEqual({ ...phases, bulletDiameter: 3.5, position: { x: 10, y: 2, z: 5 } })
  for (const invalid of [
    { ...phases, pinCount: 0 },
    { ...phases, pinCount: 17 },
    { ...phases, bulletDiameter: 7 },
    { ...phases, bulletGender: "socket" },
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
