import { expect, test } from "bun:test"
import {
  autorouterConfig,
  autorouterProp,
  autoroutingPhaseProps,
  boardProps,
  breakoutProps,
  groupProps,
  mountedboardProps,
  platformConfig,
  stampboardProps,
  subcircuitGroupProps,
  subcircuitProps,
  type AutorouterConfig,
  type AutoroutingPhaseProps,
  type BoardProps,
  type BreakoutProps,
  type MountedBoardProps,
  type PlatformConfig,
  type StampboardProps,
  type SubcircuitGroupProps,
  type SubcircuitProps,
} from "../lib"

const routingScopes = [
  { name: "autorouter config", schema: autorouterConfig, required: {} },
  { name: "autorouting phase", schema: autoroutingPhaseProps, required: {} },
  { name: "board", schema: boardProps, required: {} },
  { name: "subcircuit", schema: subcircuitProps, required: {} },
  { name: "routing group", schema: subcircuitGroupProps, required: {} },
  {
    name: "group with subcircuit",
    schema: groupProps,
    required: { subcircuit: true },
  },
  { name: "breakout", schema: breakoutProps, required: {} },
  { name: "mounted board", schema: mountedboardProps, required: {} },
  { name: "stamp board", schema: stampboardProps, required: {} },
  { name: "platform defaults", schema: platformConfig, required: {} },
] as const

for (const { name, schema, required } of routingScopes) {
  test(`${name} preserves suppression overrides and leaves omission undefined`, () => {
    for (const ignoreSuboptimalOrientationWarnings of [true, false]) {
      const parsed = schema.parse({
        ...required,
        ignoreSuboptimalOrientationWarnings,
      })
      expect(
        "ignoreSuboptimalOrientationWarnings" in parsed &&
          parsed.ignoreSuboptimalOrientationWarnings,
      ).toBe(ignoreSuboptimalOrientationWarnings)
    }
    const parsed = schema.parse(required)
    expect(
      "ignoreSuboptimalOrientationWarnings" in parsed
        ? parsed.ignoreSuboptimalOrientationWarnings
        : undefined,
    ).toBeUndefined()
    for (const invalid of ["true", "false", 0, 1, null]) {
      expect(
        schema.safeParse({
          ...required,
          ignoreSuboptimalOrientationWarnings: invalid,
        }).success,
      ).toBe(false)
    }
  })
}

test("autorouter option propagates through every scope and remains distinct from the direct override", () => {
  const config: AutorouterConfig = {
    preset: "bus_lanes",
    ignoreSuboptimalOrientationWarnings: true,
  }
  expect(autorouterProp.parse(config)).toEqual(config)
  for (const { schema, required, name } of routingScopes) {
    if (name === "autorouter config") continue
    const parsed = schema.parse({
      ...required,
      ignoreSuboptimalOrientationWarnings: false,
      autorouter: config,
    })
    expect(
      "ignoreSuboptimalOrientationWarnings" in parsed &&
        parsed.ignoreSuboptimalOrientationWarnings,
    ).toBe(false)
    expect("autorouter" in parsed && parsed.autorouter).toEqual(config)
  }
})

test("public component and config types expose the optional boolean", () => {
  const autorouter: AutorouterConfig = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const phase: AutoroutingPhaseProps = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const board: BoardProps = { ignoreSuboptimalOrientationWarnings: true }
  const subcircuit: SubcircuitProps = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const routingGroup: SubcircuitGroupProps = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const breakout: BreakoutProps = { ignoreSuboptimalOrientationWarnings: true }
  const mountedBoard: MountedBoardProps = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const stampBoard: StampboardProps = {
    ignoreSuboptimalOrientationWarnings: true,
  }
  const platform: PlatformConfig = { ignoreSuboptimalOrientationWarnings: true }
  for (const props of [
    autorouter,
    phase,
    board,
    subcircuit,
    routingGroup,
    breakout,
    mountedBoard,
    stampBoard,
    platform,
  ]) {
    expect(props.ignoreSuboptimalOrientationWarnings).toBe(true)
  }
})
