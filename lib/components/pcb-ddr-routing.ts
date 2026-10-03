import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** TI SPRS717L routing intent for one point-to-point x16 DDR3 memory.
 * Selecting the profile supplies the published rule limits, not a stackup,
 * impedance result, reference plane, or termination circuit. */
export interface PcbDdrRouting {
  profile: "ti_am335x_ddr3"
  interfaceName: string
  signalClass: "dq" | "dqs" | "ck" | "addr_ctrl"
  topology: "one_x16"
  /** Required for dq/dqs; omitted for ck/addr_ctrl. */
  byteIndex?: 0 | 1
  /** Names of the intended reference nets, without a net. selector prefix. */
  groundNetName?: string
  powerNetName?: string
}

export const pcbDdrRouting = z
  .object({
    profile: z.literal("ti_am335x_ddr3"),
    interfaceName: z.string().min(1),
    signalClass: z.enum(["dq", "dqs", "ck", "addr_ctrl"]),
    topology: z.literal("one_x16"),
    byteIndex: z.union([z.literal(0), z.literal(1)]).optional(),
    groundNetName: z.string().min(1).optional(),
    powerNetName: z.string().min(1).optional(),
  })
  .superRefine((routing, ctx) => {
    const byteClass =
      routing.signalClass === "dq" || routing.signalClass === "dqs"
    if (byteClass !== (routing.byteIndex !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["byteIndex"],
        message: byteClass
          ? "dq/dqs require a byteIndex"
          : "ck/addr_ctrl do not have a byteIndex",
      })
    }
  })
expectTypesMatch<PcbDdrRouting, z.input<typeof pcbDdrRouting>>(true)
