import { distance, type Distance } from "lib/common/distance"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface FiducialProps extends CommonComponentProps {
  soldermaskPullback?: Distance
  padDiameter?: Distance
}

export const fiducialProps = commonComponentProps.extend({
  soldermaskPullback: distance.optional(),
  padDiameter: distance.optional(),
})

type InferredFiducialProps = z.input<typeof fiducialProps>
expectTypesMatch<FiducialProps, InferredFiducialProps>(true)
