# Routing intent on buses and differential pairs

Put matching, length, spacing and impedance requirements directly on the existing `<bus>` and `<differentialpair>` elements. The props describe engineering intent; there is no rules element, protocol profile, constraint wrapper, or check-only bus.

```tsx
import type { RelativeRouteLength } from "@tscircuit/props"

const commandLength = {
  reference: "longest_manhattan",
  of: [".DDR_COMMANDS", ".DDR_CLOCK"],
  offset: "300mil",
} satisfies RelativeRouteLength

<>
  <bus
    name="DDR_BYTE0"
    connections={[...dataSignals0, dataMask0]}
    lengthMatchTo=".DDR_STROBE0"
    maxLengthSkew="25mil"
    maxLength={{ reference: "longest_manhattan" }}
    targetImpedanceMin="50ohm"
    targetImpedanceMax="75ohm"
    pcbTraceSpacing="3w"
    pcbSpacingToOtherSignals="4w"
  />
  <differentialpair
    name="DDR_STROBE0"
    positiveConnection={strobePositive0}
    negativeConnection={strobeNegative0}
    maxLengthSkew="5mil"
    targetDifferentialImpedance="125±25ohm"
    pcbTraceGap="0.12mm"
    pcbSpacingToOtherSignals="4w"
  />
  <bus
    name="DDR_COMMANDS"
    connections={commandSignals}
    targetLength={commandLength}
    lengthTolerance="50mil"
    targetImpedanceMin="50ohm"
    targetImpedanceMax="75ohm"
    pcbTraceSpacing="3w"
    pcbSpacingToOtherSignals="4w"
  />
  <differentialpair
    name="DDR_CLOCK"
    positiveConnection={clockPositive}
    negativeConnection={clockNegative}
    maxLengthSkew="5mil"
    targetLength={commandLength}
    lengthTolerance="50mil"
    targetDifferentialImpedance="125±25ohm"
    pcbTraceGap="0.12mm"
    pcbSpacingToOtherSignals="4w"
  />
</>
```

The values above are supplied by the author, not inferred from the signal names. Declare the second byte and its strobe in the same way, with their own connections and relationship. `connections` and the pair's positive/negative connections define membership; no repeated expected-member-count or data/clock class is required. Decoupling and power intent can use existing pin attributes such as `requiresPower`, `requiresGround`, `shouldHaveDecouplingCapacitor`, and `recommendedDecouplingCapacitorCapacitance`.

## Lengths

`minLength`, `maxLength` and `targetLength` accept a number in mm, a distance string, or `{ reference: "longest_manhattan", of?, offset? }`. An explicit `of` array selects trace names or port/bus/pair selectors. Without `of`, the reference uses this element's members and any members selected by `lengthMatchTo`. The reference is the longest pad-to-pad Manhattan distance; an omitted offset means zero. An offset may be negative; absolute lengths must be nonnegative. Measurements are in board-world XY mm (+X right, +Y up).

`lengthMatchTo` accepts one selector/name or an array. It expands the comparison set for `maxLengthSkew`, without changing electrical membership. The skew limit is explicit and applies to the combined set. A pair can have its own tighter skew limit while the bus's strobe relationship has a looser limit.

`targetLength` and `lengthTolerance` must appear together. The tolerance is a nonnegative distance above and below the target; explicit zero requests exact matching. No matching tolerance is chosen automatically. Contradictory min/max bounds using the same reference, or a target tolerance window wholly outside comparable bounds, are rejected. Different references require evaluation against actual geometry.

## Spacing

`pcbTraceSpacing` is a bus's minimum centreline spacing between member traces, excluding explicit differential-pair partners. A pair keeps its existing edge-to-edge `pcbTraceGap`; there is no competing internal-spacing prop on the pair.

`pcbSpacingToOtherSignals` applies to traces outside the bus or pair, including unrelated copper traces, rather than requiring a hand-written list of every other bus. Distances can be mm or unit strings. A width-relative string such as `"3w"` means three times the larger local trace width; it parses as `{ widthMultiplier: 3 }`, preserving the rule until copper geometry is available.

Tight-escape spacing exceptions are not part of this API.

## Impedance and compatibility

The existing `targetImpedance` and `targetDifferentialImpedance` props accept a number in ohms, a unit string, or an absolute tolerance string such as `"50±25ohm"`. The latter means nominal 50 ohms and inclusive bounds 25–75 ohms; `"±"` is an absolute tolerance, not a percentage. ASCII `"+/-"` is accepted equivalently. A unit written once applies to both quantities, so `"1±0.1kohm"` means 1000 ± 100 ohms. Explicit units on both quantities are also accepted.

Alternatively, use `targetImpedanceMin` and `targetImpedanceMax`, or `targetDifferentialImpedanceMin` and `targetDifferentialImpedanceMax`. These accept scalar numeric ohms or unit strings. Either bound can be specified independently; bounds alone do not invent a nominal target. Differential values are differential impedance directly, without a single-ended conversion.

```tsx
<bus connections={dataSignals} targetImpedance="50±25ohm" />
// Equivalent allowed bounds, without a nominal target:
<bus connections={dataSignals} targetImpedanceMin="25ohm" targetImpedanceMax="75ohm" />
```

Parsing expands a tolerance string to flat scalar props: `targetImpedance: 50`, `targetImpedanceMin: 25`, `targetImpedanceMax: 75`. The same normalization applies to differential targets. Existing scalar targets still parse to numbers without inferred tolerances. Bounds must be finite, positive and ordered; tolerance is nonnegative and must leave a positive lower bound. A scalar target must lie within any explicit bounds. When a tolerance string and explicit bounds are both present, they must agree; conflicts are rejected rather than silently replaced.

All new props are optional, with no electrical defaults. Impedance range objects are rejected. Relative length objects remain available in the current length API; this update makes impedance authoring scalar/XML-compatible. Width-relative spacing still parses to a multiplier internally, while its author-facing input is a string.

This PR defines the author-facing props and parsing contract. Core/solver/checks support must be adapted to this API before the example is advertised as executable. Props alone do not establish actual impedance, reference-plane continuity, termination, decoupling, flight time or hardware compliance.

The unmerged `pcbRoutingConstraints` wrapper and `routingDisabled` check-only grouping API are removed. Replace their length/spacing fields with the direct props and `lengthMatchTo`; use existing connections for membership and scalar/tolerance or separate bound impedance props for impedance intent. No compatibility alias is retained for the unshipped wrapper.

`pcbEscapeSpacing` has been removed for now. The unshipped object impedance range is replaced by a tolerance string or separate Min/Max props, with no compatibility alias.
