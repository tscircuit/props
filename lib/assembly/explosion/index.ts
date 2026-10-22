import { assemblyExplosionMoveProps } from "./move"
import { assemblyExplosionStageProps } from "./stage"

export * from "./move"
export * from "./stage"

/** Explosion elements; no separate explosion container is needed. */
export const assemblyExplosionProps = {
  stage: assemblyExplosionStageProps,
  move: assemblyExplosionMoveProps,
} as const
