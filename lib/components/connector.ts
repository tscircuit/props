import { chipProps, type ChipPropsSU } from "./chip"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { distance } from "lib/common/distance"

export const connectorStandard = z.enum([
  "usb_c",
  "bullet",
  "m2",
  "jst_sh",
  "jst_gh",
  "jst_zh",
  "jst_ph",
  "jst_xh",
  "jst_vh",
])

export type ConnectorStandard = z.infer<typeof connectorStandard>

export interface ConnectorProps extends ChipPropsSU {
  /**
   * Connector interface or product family, e.g. usb_c, m2, jst_ph
   */
  standard?: ConnectorStandard

  /**
   * Number of electrical circuits in the connector
   */
  pinCount?: number

  /** Nominal bullet contact diameter in mm or a length string; required for bullet. */
  bulletDiameter?: number | string
  /** Gender of the endpoint connector; the attached cable uses the opposite gender. */
  bulletGender?: "male" | "female"
}

export const connectorProps = chipProps
  .extend({
    standard: connectorStandard.optional(),
    pinCount: z.number().int().positive().optional(),
    bulletDiameter: distance
      .pipe(
        z.union([
          z.literal(2),
          z.literal(3),
          z.literal(3.5),
          z.literal(4),
          z.literal(5),
          z.literal(5.5),
          z.literal(6),
          z.literal(8),
        ]),
      )
      .optional(),
    bulletGender: z.enum(["male", "female"]).optional(),
  })
  .superRefine((connector, ctx) => {
    if (connector.standard === "bullet") {
      for (const field of ["bulletDiameter", "bulletGender"] as const) {
        if (connector[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is required for bullet connectors`,
          })
      }
      if (connector.pinCount !== undefined && connector.pinCount !== 1)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pinCount"],
          message: "A bullet connector has one electrical contact",
        })
    } else if (
      connector.bulletDiameter !== undefined ||
      connector.bulletGender !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "bulletDiameter and bulletGender require standard=bullet",
      })
    }
  })

export type ParsedConnectorProps = z.output<typeof connectorProps>

type InferredConnectorProps = z.input<typeof connectorProps>
expectTypesMatch<ConnectorProps, InferredConnectorProps>(true)
