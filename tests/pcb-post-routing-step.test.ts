import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import type {
  PcbPostRoutingContext,
  PcbPostRoutingFn,
  PcbPostRoutingRenderFn,
} from "lib/common/pcbPostRouting"
import {
  type PcbPostRoutingStepProps,
  pcbPostRoutingStepProps,
} from "lib/components/pcb-post-routing-step"

test("pcbpostroutingstep keeps fn and render as given", () => {
  const fn: PcbPostRoutingFn = () => {}
  const render: PcbPostRoutingRenderFn = async () => null
  const parsed = pcbPostRoutingStepProps.parse({ name: "pads", order: 2, fn })
  expect(parsed.fn).toBe(fn)
  expect(parsed.order).toBe(2)
  expect(pcbPostRoutingStepProps.parse({ render }).render).toBe(render)
})

test("pcbpostroutingstep has no default order", () => {
  expect(pcbPostRoutingStepProps.parse({ fn: () => {} }).order).toBeUndefined()
})

test("pcbpostroutingstep needs fn or render", () => {
  expect(pcbPostRoutingStepProps.safeParse({ name: "empty" }).success).toBe(
    false,
  )
})

test("pcbpostroutingstep rejects non-functions", () => {
  for (const value of ["fn", 1, true, null, {}, []]) {
    expect(pcbPostRoutingStepProps.safeParse({ fn: value }).success).toBe(false)
    expect(pcbPostRoutingStepProps.safeParse({ render: value }).success).toBe(
      false,
    )
  }
})

test("pcbpostroutingstep fn is typed with its context", () => {
  const props: PcbPostRoutingStepProps = {
    fn: (ctx) => {
      expectTypeOf(ctx).toEqualTypeOf<PcbPostRoutingContext>()
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
      ctx.update(pad.pcb_smtpad_id, { x: 1.2 })
      ctx.remove(pad.pcb_smtpad_id)
      // @ts-expect-error only PCB elements can be inserted
      ctx.insert({ type: "source_component" })
    },
    render: (ctx) => {
      expectTypeOf(ctx).toEqualTypeOf<PcbPostRoutingContext>()
      return null
    },
  }
  expect(typeof props.fn).toBe("function")
})
