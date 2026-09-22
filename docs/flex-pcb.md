# Flex PCB bends and stiffeners

`pcbBendProps` / `PcbBendProps` and `pcbStiffenerProps` /
`PcbStiffenerProps` define the authoring contracts for `<pcbbend />` and
`<pcbstiffener />`. This package supplies types and Zod parsers only. Core JSX
registration, Circuit JSON records, 3D folding, routing/DRC, and fabrication
exports require downstream implementation before these TSX examples can render.

## Flex board with reinforced component sections

One continuous flex circuit can have FR4 stiffeners beneath its component areas,
leaving an unsupported flexible bridge between them. The stiffeners do not add
copper layers. All placement and routing coordinates refer to the flat board.

```tsx
export default () => (
  <board
    material="flex"
    layers={2}
    thickness="0.11mm"
    outline={[
      { x: -40, y: -15 }, { x: -15, y: -15 },
      { x: -15, y: -5 }, { x: 15, y: -5 },
      { x: 15, y: -15 }, { x: 40, y: -15 },
      { x: 40, y: 15 }, { x: 15, y: 15 },
      { x: 15, y: 5 }, { x: -15, y: 5 },
      { x: -15, y: 15 }, { x: -40, y: 15 },
    ]}
  >
    {[-27.5, 27.5].map((x, i) => (
      <pcbstiffener
        key={i}
        name={`S${i + 1}`}
        shape="rect"
        pcbX={x}
        pcbY={0}
        width="25mm"
        height="30mm"
        layer="bottom"
        material="fr4"
        thickness="0.4mm"
      />
    ))}
    <pcbbend
      name="B1"
      x1={0} y1={-5}
      x2={0} y2={5}
      bendAngle={90}
      bendRadius="3mm"
      bendSide="right"
    />
    <resistor name="R1" resistance="10k" footprint="0402" pcbX={-27.5} />
    <resistor name="R2" resistance="10k" footprint="0402" pcbX={27.5} />
    <trace from=".R1 > .pin2" to=".R2 > .pin1" />
  </board>
)
```

The left and right sections are each 25 × 30 mm. A 30 × 10 mm flex bridge
connects them, with the bend centered in the bridge. Dimensions illustrate the
API; they are not a fabrication preset or a manufacturer approval.

JLCPCB's [flex capabilities](https://jlcpcb.com/capabilities/flex-pcb-capabilities)
list FR4, PI, and metal stiffeners. At the time this example was written, the
capability table said rigid-flex was unsupported while the FAQ described
case-by-case evaluation. A flex circuit with bonded reinforcement is distinct
from an integrated rigid-flex stackup.

## Polygon stiffener in a reusable group

```tsx
<group name="sensorSupport" pcbX={-27.5} pcbY={0}>
  <pcbstiffener
    name="support"
    shape="polygon"
    outline={[
      { x: -5, y: -4 }, { x: 5, y: -4 },
      { x: 5, y: 2 }, { x: 3, y: 4 }, { x: -5, y: 4 },
    ]}
    layer="bottom"
    material="fr4"
    thickness="0.4mm"
    adhesiveThickness="0.05mm"
  />
</group>
```

## Input and normalization contract

- Distances accept numbers (millimeters) or existing distance-parser strings,
  normalized to millimeters. Bend endpoints are finite, distinct points in the
  parent's flat PCB coordinate system, following the endpoint convention of
  `<pcbnoteline />`. Group transforms are a downstream responsibility.
- `bendAngle` accepts numbers (degrees) or the existing rotation-parser strings
  (for example `"90deg"` or `"1.5707963267948966rad"`), normalized to finite signed
  degrees. Zero means flat. Angles are not clamped or wrapped.
- `bendSide` is `"left"` or `"right"` relative to the directed start-to-end line
  viewed from the flat PCB's top. It selects the moving side. Positive angles
  fold that side toward the local top face, negative toward the bottom.
- `bendRadius` is a finite positive radius at the neutral surface. The centerline
  bisects a bend zone with developed width `radius * abs(angle in radians)`.
  It is not a zero-width hinge or an inside-surface radius.
- Stiffeners use existing PCB layout props. Rectangles are centered on their
  placement anchor. Polygon `outline` vertices are local to the stiffener and
  implicitly closed, then positioned/rotated with `pcbX`, `pcbY`, `pcbRotation`.
  At least three finite vertices and nonzero signed area are required.
- `layer` must explicitly be `"top"` or `"bottom"`. `material` must explicitly be
  `"fr4"`, `"polyimide"`, `"stainless_steel"`, or `"aluminum"`.
- `thickness`, rectangle `width`, and `height` must be finite and positive.
  `adhesiveThickness` is finite and nonnegative. It is separate from material
  thickness, and remains unspecified if omitted. Manufacturer thickness
  conventions may include adhesive and must be translated at export time.
- All bend geometry and stiffener shape/material/face/thickness are required.
  Optional `name` follows existing stable identity conventions. No new prop has
  an implicit design-value default or alias. Rectangle `outline` and polygon
  `width`/`height` are conflicting geometry and are rejected. Other unknown keys
  are stripped following the repository's default Zod object behavior.
- This is additive; existing boards require no migration. Bend/stiffener
  intersections, simple-polygon validity, board containment, layer-stack
  compatibility, and manufacturer rules require board-level downstream checks.
  Multiple bends require consistent region transforms, independent of JSX order.

## Integrated rigid-flex: future API direction

A rigid section with additional copper layers needs regional stackups, including
which copper layers continue into the flex bridge. A stiffener cannot express
this. A future region primitive might look like the sketch below; **neither
`<pcbregion />` nor the stackup references below are implemented by this PR**:

```tsx
// Concept only: stackup definitions must also specify copper continuity.
<board outline={outline}>
  <pcbregion name="left" outline={leftOutline} stackup="rigid4Layer" />
  <pcbregion name="bridge" outline={bridgeOutline} stackup="flex2Layer" />
  <pcbregion name="right" outline={rightOutline} stackup="rigid4Layer" />
  <pcbbend
    name="B1"
    x1={0} y1={-5} x2={0} y2={5}
    bendAngle={90} bendRadius="3mm" bendSide="right"
  />
</board>
```
