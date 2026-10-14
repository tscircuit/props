import { distance, pcbCoordinate, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import {
  cadModelBase,
  type CadModelBase,
  cadModelJscad,
} from "../common/cadModel"
import { url } from "lib/common/url"
import { z } from "zod"

const pcbPosition = z.object({
  pcbX: pcbCoordinate.optional(),
  pcbY: pcbCoordinate.optional(),
  pcbLeftEdgeX: pcbCoordinate.optional(),
  pcbRightEdgeX: pcbCoordinate.optional(),
  pcbTopEdgeY: pcbCoordinate.optional(),
  pcbBottomEdgeY: pcbCoordinate.optional(),
  pcbOffsetX: distance.optional(),
  pcbOffsetY: distance.optional(),
  pcbZ: distance.optional(),
})

/** Parsed CAD model props. Author model strings with CadModelPropsInput. */
export interface CadModelProps extends CadModelBase {
  /** Canonical model URL after parsing; authored model strings resolve to this field. */
  modelUrl?: string
  /** Procedural model operation tree. */
  jscad?: Record<string, any>
  pcbX?: Distance
  pcbY?: Distance
  pcbLeftEdgeX?: Distance
  pcbRightEdgeX?: Distance
  pcbTopEdgeY?: Distance
  pcbBottomEdgeY?: Distance
  pcbOffsetX?: Distance
  pcbOffsetY?: Distance
  pcbZ?: Distance
}

const cadModelBaseWithUrl = cadModelBase.extend({
  modelUrl: url,
  stepUrl: url.optional(),
  jscad: z.never().optional(),
})

const cadModelUrlObject = cadModelBaseWithUrl.merge(pcbPosition)
const cadModelJscadObject = cadModelJscad
  .extend({
    model: z.never().optional(),
    modelUrl: z.never().optional(),
  })
  .merge(pcbPosition)

const cadModelInputObject = cadModelBase
  .extend({
    /** Modelprinter specification or HTTP(S) URL; mutually exclusive with modelUrl. */
    model: z.string().trim().min(1).optional(),
    modelUrl: url.optional(),
    jscad: z.never().optional(),
  })
  .merge(pcbPosition)
  .refine(
    (props) => (props.model === undefined) !== (props.modelUrl === undefined),
    {
      message: "Provide exactly one of model or modelUrl",
      path: ["model"],
    },
  )
  .transform(({ model, ...props }) => ({
    ...props,
    modelUrl:
      model === undefined
        ? props.modelUrl!
        : /^https?:\/\//i.test(model)
          ? model
          : `https://modelcdn.tscircuit.com/jscad_models/${encodeURIComponent(model)}.glb`,
  }))
  .pipe(cadModelUrlObject)

expectTypesMatch<
  z.output<typeof cadModelUrlObject>,
  z.output<typeof cadModelInputObject>
>(true)

/**
 * Object inputs require one model source: model, modelUrl, or jscad.
 * Modelprinter strings are trimmed and resolved to modelUrl; HTTP(S) model URLs
 * and JSCAD operations are preserved. Parsed URL objects omit the model alias.
 * Existing modelUrl objects, bare URL strings, and null remain supported.
 */
export const cadmodelProps = z.union([
  z.null(),
  url,
  cadModelInputObject,
  cadModelJscadObject,
])

export type CadModelPropsInput = z.input<typeof cadmodelProps>
