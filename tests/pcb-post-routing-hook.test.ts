import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { boardProps, type BoardProps } from "lib/components/board"
import { groupProps, subcircuitGroupProps } from "lib/components/group"
import type {
  PcbPostRoutingHook,
  PcbPostRoutingHookContext,
} from "lib/common/pcbPostRoutingHook"

test("pcbPostRoutingHook keeps the function as given on boards and subcircuit groups", () => {
  const hook: PcbPostRoutingHook = () => {}
  const asyncHook: PcbPostRoutingHook = async () => {}
  expect(
    boardProps.parse({ pcbPostRoutingHook: hook }).pcbPostRoutingHook,
  ).toBe(hook)
  expect(
    subcircuitGroupProps.parse({ pcbPostRoutingHook: asyncHook })
      .pcbPostRoutingHook,
  ).toBe(asyncHook)
  const group = groupProps.parse({ subcircuit: true, pcbPostRoutingHook: hook })
  expect(group.subcircuit && group.pcbPostRoutingHook).toBe(hook)
})

test("pcbPostRoutingHook has no default", () => {
  expect(boardProps.parse({}).pcbPostRoutingHook).toBeUndefined()
})

test("pcbPostRoutingHook rejects non-functions", () => {
  for (const pcbPostRoutingHook of ["fn", 1, true, null, {}, []]) {
    expect(boardProps.safeParse({ pcbPostRoutingHook }).success).toBe(false)
  }
})

test("pcbPostRoutingHook is typed with its context", () => {
  const props: BoardProps = {
    pcbPostRoutingHook: (ctx) => {
      expectTypeOf(ctx).toEqualTypeOf<PcbPostRoutingHookContext>()
      const port = ctx.getPcbPort(".U1 > .pin1")!
      const pad = ctx.insert({
        type: "pcb_smtpad",
        shape: "circle",
        x: 1,
        y: 0,
        radius: 0.3,
        layer: "top",
        pcb_port_id: port.pcb_port_id,
        pcb_component_id: port.pcb_component_id,
      })
      expectTypeOf(pad.pcb_smtpad_id).toEqualTypeOf<string>()
      ctx.insert({
        type: "pcb_via",
        x: 2,
        y: 2,
        outer_diameter: 0.6,
        hole_diameter: 0.3,
        layers: ["top", "bottom"],
      })
      ctx.update(pad.pcb_smtpad_id, { x: 1.2 })
      ctx.remove(pad.pcb_smtpad_id)
      // @ts-expect-error only PCB elements can be inserted
      ctx.insert({ type: "source_component" })
    },
  }
  expect(typeof props.pcbPostRoutingHook).toBe("function")
})
