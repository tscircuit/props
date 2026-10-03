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
    targetImpedance={{ min: "50ohm", max: "75ohm" }}
    pcbTraceSpacing="3w"
    pcbExternalTraceSpacing="4w"
    pcbReducedTraceSpacing="1w"
    maxReducedSpacingLength="1250mil"
  />
  <differentialpair
    name="DDR_STROBE0"
    positiveConnection={strobePositive0}
    negativeConnection={strobeNegative0}
    maxLengthSkew="5mil"
    targetDifferentialImpedance={{ min: "100ohm", max: "150ohm" }}
    pcbTraceGap="0.12mm"
    pcbExternalTraceSpacing="4w"
    pcbReducedTraceSpacing="1w"
    maxReducedSpacingLength="1250mil"
  />
  <bus
    name="DDR_COMMANDS"
    connections={commandSignals}
    targetLength={commandLength}
    lengthTolerance="50mil"
    targetImpedance={{ min: "50ohm", max: "75ohm" }}
    pcbTraceSpacing="3w"
    pcbExternalTraceSpacing="4w"
    pcbReducedTraceSpacing="1w"
    maxReducedSpacingLength="1250mil"
  />
  <differentialpair
    name="DDR_CLOCK"
    positiveConnection={clockPositive}
    negativeConnection={clockNegative}
    maxLengthSkew="5mil"
    targetLength={commandLength}
    lengthTolerance="50mil"
    targetDifferentialImpedance={{ min: "100ohm", max: "150ohm" }}
    pcbTraceGap="0.12mm"
    pcbExternalTraceSpacing="4w"
    pcbReducedTraceSpacing="1w"
    maxReducedSpacingLength="1250mil"
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

`pcbExternalTraceSpacing` applies to traces outside the bus or pair, including unrelated copper traces, rather than requiring a hand-written list of every other bus. Distances can be mm or unit strings. A width-relative string such as `"3w"` means three times the larger local trace width; it parses as `{ widthMultiplier: 3 }`, preserving the rule until copper geometry is available.

`pcbReducedTraceSpacing` and `maxReducedSpacingLength` must appear together, with at least one normal spacing requirement. The length cap is shared across all reduced-spacing regions and neighbours for each signal; overlapping regions count once. Reduced spacing cannot exceed normal spacing when the values are comparable. Comparing an absolute distance with a width multiple requires actual trace widths. Pair-internal spacing is governed by `pcbTraceGap`, not the reduced-spacing allowance.

## Impedance and compatibility

The existing `targetImpedance` and `targetDifferentialImpedance` props accept either their original scalar target or `{ min, max }`. Raw numbers are ohms; unit strings normalize to ohms. Ranges must be ordered, finite and positive. Differential values are differential impedance directly; no single-ended conversion is inferred.

All new props are optional and have no electrical defaults or aliases. Existing scalar impedance values still parse to numbers; range values parse to numeric `{ min, max }`. Distances parse to mm, relative expressions keep their selectors and normalized offset, and width multiples keep their multiplier. Consumers must handle these explicit forms.

This PR defines the author-facing props and parsing contract. Core/solver/checks support must be adapted to this API before the example is advertised as executable. Props alone do not establish actual impedance, reference-plane continuity, termination, decoupling, flight time or hardware compliance.

The unmerged `pcbRoutingConstraints` wrapper and `routingDisabled` check-only grouping API are removed. Replace their length/spacing fields with the direct props and `lengthMatchTo`; use existing connections for membership and scalar/range impedance targets for impedance intent. No compatibility alias is retained for the unshipped wrapper.
