import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { panelProps, type PanelProps } from "./panel"

export interface SubpanelProps extends PanelProps {}

export const subpanelProps = panelProps

type InferredSubpanelProps = z.input<typeof subpanelProps>
expectTypesMatch<SubpanelProps, InferredSubpanelProps>(true)
