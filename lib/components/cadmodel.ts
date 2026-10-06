import { distance, pcbCoordinate, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { cadModelBase, type CadModelBase } from "../common/cadModel"
import { url } from "lib/common/url"
import { z } from "zod"

/** Parsed CAD model props. Author model strings with CadModelPropsInput. */
export interface CadModelProps extends CadModelBase {
  /** Canonical model URL after parsing; authored model strings resolve to this field. */
  modelUrl: string
  stepUrl?: string
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

const cadModelBaseWithUrl = cadModelBase.extend({
  modelUrl: url,
  stepUrl: url.optional(),
})

const cadModelObject = cadModelBaseWithUrl.merge(pcbPosition)
expectTypesMatch<CadModelProps, z.input<typeof cadModelObject>>(true)

const cadModelInputObject = cadModelBase
  .extend({
    /** Modelprinter specification or HTTP(S) URL; mutually exclusive with modelUrl. */
    model: z.string().trim().min(1).optional(),
    modelUrl: url.optional(),
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
  .pipe(cadModelObject)

expectTypesMatch<
  z.output<typeof cadModelObject>,
  z.output<typeof cadModelInputObject>
>(true)

/**
 * Object inputs require exactly one of model or modelUrl. Modelprinter strings
 * are trimmed and resolved to modelUrl; HTTP(S) model URLs are preserved.
 * Parsed objects retain the existing CadModelProps shape, without a model field.
 * Existing modelUrl objects, bare URL strings, and null remain supported.
 */
export const cadmodelProps = z.union([z.null(), url, cadModelInputObject])

export type CadModelPropsInput = z.input<typeof cadmodelProps>
