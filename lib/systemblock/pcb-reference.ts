import { z } from "zod"

/** Optional PCB associations shared only by system blocks and their groups. */
export interface SystemBlockPcbReferenceProps {
  /** One PCB component name; mutually exclusive with pcbComponentNames. */
  pcbComponentName?: string
  /** Nonempty list of PCB component names; mutually exclusive with pcbComponentName. */
  pcbComponentNames?: string[]
  /**
   * Named PCB subcircuit in which component names are resolved. Without component
   * names, associates the entire subcircuit. Omitted uses the owning circuit scope.
   * References are names, not selectors; resolution is performed by the consumer.
   */
  pcbSubcircuitName?: string
}

const pcbName = z.string().trim().min(1)

export const systemBlockPcbReferenceShape = {
  pcbComponentName: pcbName.optional(),
  pcbComponentNames: z.array(pcbName).min(1).optional(),
  pcbSubcircuitName: pcbName.optional(),
}

export function refineSystemBlockPcbReference(
  props: SystemBlockPcbReferenceProps,
  ctx: z.RefinementCtx,
) {
  if (
    props.pcbComponentName !== undefined &&
    props.pcbComponentNames !== undefined
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pcbComponentNames"],
      message: "Provide either pcbComponentName or pcbComponentNames, not both",
    })
  }
}
