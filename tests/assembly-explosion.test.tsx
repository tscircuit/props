import { expect, test } from "bun:test"
import {
  type AssemblyExplosionMoveProps,
  type AssemblyExplosionMovePropsInput,
  type AssemblyExplosionStageProps,
  type AssemblyExplosionStagePropsInput,
  assemblyExplosionMoveProps,
  assemblyExplosionProps,
  assemblyExplosionStageProps,
  assemblyProps,
  assemblySubassemblyProps,
} from "lib"
import { createElement, type ReactNode } from "react"

test("exports stage and move through the nested explosion namespace", () => {
  expect(assemblyProps.explosion).toBe(assemblyExplosionProps)
  expect(assemblyProps.explosion.stage).toBe(assemblyExplosionStageProps)
  expect(assemblyProps.explosion.move).toBe(assemblyExplosionMoveProps)
  expect(Object.keys(assemblyProps.explosion).sort()).toEqual(["move", "stage"])
})

test("trims stage identities and ordering hints without adding defaults", () => {
  const input: AssemblyExplosionStageProps = {
    name: " remove-cover ",
    prevStageRef: " remove-screws ",
    nextStageRef: " cover.remove-window ",
  }
  const props: AssemblyExplosionStagePropsInput = input
  expect(assemblyExplosionStageProps.parse(props)).toEqual({
    name: "remove-cover",
    prevStageRef: "remove-screws",
    nextStageRef: "cover.remove-window",
  })
  expect(assemblyExplosionStageProps.parse({ name: "lift" })).toEqual({
    name: "lift",
  })
})

test("rejects missing, blank, or invalid stage identities and hints", () => {
  for (const input of [
    {},
    { name: "" },
    { name: " " },
    { name: 1 },
    { name: "lift", nextStageRef: " " },
    { name: "lift", prevStageRef: "" },
    { name: "lift", nextStageRef: null },
    { name: "lift", prevStageRef: 1 },
  ]) {
    expect(assemblyExplosionStageProps.safeParse(input).success).toBe(false)
  }
})

test("converts signed offsets to finite millimeters and leaves absent axes omitted", () => {
  const input: AssemblyExplosionMoveProps = {
    targetRef: " cover ",
    offX: "-2cm",
    offY: 0,
    offZ: "1in",
  }
  const props: AssemblyExplosionMovePropsInput = input
  expect(assemblyExplosionMoveProps.parse(props)).toEqual({
    targetRef: "cover",
    offX: -20,
    offY: 0,
    offZ: 25.4,
  })
  for (const axis of ["offX", "offY", "offZ"] as const) {
    expect(
      assemblyExplosionMoveProps.parse({ targetRef: "cover", [axis]: 0 }),
    ).toEqual({ targetRef: "cover", [axis]: 0 })
    expect(
      assemblyExplosionMoveProps.parse({
        targetRef: "cover.window",
        [axis]: "-5mm",
      }),
    ).toEqual({ targetRef: "cover.window", [axis]: -5 })
  }
})

test("rejects invalid move targets, missing offsets, and nonfinite distances", () => {
  for (const input of [
    {},
    { offZ: 10 },
    { targetRef: "", offZ: 10 },
    { targetRef: " ", offZ: 10 },
    { targetRef: 1, offZ: 10 },
    { targetRef: "cover" },
  ]) {
    expect(assemblyExplosionMoveProps.safeParse(input).success).toBe(false)
  }
  for (const axis of ["offX", "offY", "offZ"] as const) {
    for (const value of [
      "nonsense",
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      null,
    ]) {
      expect(
        assemblyExplosionMoveProps.safeParse({
          targetRef: "cover",
          [axis]: value,
        }).success,
      ).toBe(false)
    }
  }
})

test("TSX preserves move targets and ordered children inside subassemblies", () => {
  // Props supplies validators; core supplies the namespaced JSX components.
  const assembly = {
    explosion: {
      stage: (props: AssemblyExplosionStagePropsInput) =>
        createElement("assembly.explosion.stage", props),
      move: (props: AssemblyExplosionMovePropsInput) =>
        createElement("assembly.explosion.move", props),
    },
  }
  const firstMove = <assembly.explosion.move targetRef="cover" offZ="12mm" />
  const secondMove = <assembly.explosion.move targetRef="cover" offX="60mm" />
  expect(assemblyExplosionMoveProps.parse(firstMove.props)).toEqual({
    targetRef: "cover",
    offZ: 12,
  })
  const stage = (
    <assembly.explosion.stage
      name="remove-cover"
      nextStageRef="cover.remove-window"
    >
      {firstMove}
      {secondMove}
    </assembly.explosion.stage>
  )
  const parsed = assemblyExplosionStageProps.parse(stage.props)
  expect(parsed.children).toBe(stage.props.children)
  expect(parsed.children).toEqual([firstMove, secondMove])
  expect(
    assemblySubassemblyProps.parse({ name: "module", children: stage })
      .children,
  ).toBe(stage)
  const emptyChildren: ReactNode = null
  expect(
    assemblyExplosionStageProps.parse({
      name: "pause",
      children: emptyChildren,
    }).children,
  ).toBeNull()
})
