export interface ImplicitBreakoutPoint {
  readonly x: number
  readonly y: number
}

export interface ImplicitBreakoutBounds {
  readonly minX: number
  readonly maxX: number
  readonly minY: number
  readonly maxY: number
}

export type ImplicitBreakoutEdge = "left" | "right" | "bottom" | "top"

export interface ImplicitBreakoutRegion {
  readonly regionId: string
  readonly bounds: ImplicitBreakoutBounds
  readonly edge: ImplicitBreakoutEdge
}

export interface ImplicitBreakoutConnectionEndpoint {
  readonly regionId: string
  readonly position: ImplicitBreakoutPoint
  /**
   * Optional PCB world-space routing destination, in millimeters, beyond this
   * breakout region. A solver may use it to select and align a nearer edge.
   */
  readonly externalDestination?: ImplicitBreakoutPoint
}

export interface ImplicitBreakoutConnection {
  readonly connectionId: string
  readonly endpoints: readonly ImplicitBreakoutConnectionEndpoint[]
}

export interface ImplicitBreakoutDifferentialPair {
  readonly type: "differential"
  readonly connections: readonly [
    ImplicitBreakoutConnection,
    ImplicitBreakoutConnection,
  ]
}

export type ImplicitBreakoutConnectionOrDifferentialPair =
  | ImplicitBreakoutConnection
  | ImplicitBreakoutDifferentialPair

export interface ImplicitBreakoutBus {
  readonly busId: string
  readonly connectionIds: readonly string[]
  /** Ordered candidate layers that the solver may distribute this bus over. */
  readonly targetLayers?: readonly string[]
}

export interface ImplicitBreakoutPointSolverInput {
  readonly regions: readonly ImplicitBreakoutRegion[]
  readonly connections: readonly ImplicitBreakoutConnectionOrDifferentialPair[]
  readonly buses: readonly ImplicitBreakoutBus[]
  readonly boundaryPointSpacing: number
}

export interface ImplicitBreakoutSolverPoint extends ImplicitBreakoutPoint {
  readonly regionId: string
  readonly connectionId: string
  readonly layer: string
}

export interface ImplicitBreakoutPointSolverOutput {
  readonly breakoutPoints: readonly ImplicitBreakoutSolverPoint[]
}

export type ImplicitBreakoutPointSolverFn = (
  input: ImplicitBreakoutPointSolverInput,
) =>
  | ImplicitBreakoutPointSolverOutput
  | Promise<ImplicitBreakoutPointSolverOutput>
