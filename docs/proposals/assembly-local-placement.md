# Local placement for assembly geometry

This proposal adds an authoring and validation contract to `@tscircuit/props`.
Applying the transforms and preserving hierarchy require matching core,
Circuit JSON, and exporter support; this PR alone does not move geometry.

## Motivation and measured behavior

A 158-part XYZ gantry required every moving part's world position to be computed
by the author. In core `e49981fe34e40207a1e947a3347f3213c082c350`, a parent
subassembly's `cadModel.positionOffset.x = 100` and a child's
`cadModel.positionOffset.x = 5` emit CAD positions 100 and 5, respectively.
The parent's model offset is intentionally an offset of its own geometry, not
a transform of its descendants. Named reference surfaces also share the part's
origin rather than its model offset. The native GLB contains 158 flat mesh nodes.

Keep those model-alignment semantics and introduce a separate assembly frame.

```tsx
<assembly.subassembly
  name="BRIDGE"
  cadPosition={{ x: 0, y: bridgeY, z: 0 }}
>
  <assembly.subassembly
    name="X_CARRIAGE"
    cadPosition={{ x: carriageX, y: 0, z: 0 }}
  >
    <assembly.part
      name="RAIL"
      modelUrl="./rail.step"
      cadPosition={{ x: 5, y: 0, z: "20mm" }}
    />
  </assembly.subassembly>
</assembly.subassembly>
```

## Accepted props and canonical output

`assembly.part`, `assembly.printedpart`, `assembly.subassembly`, and the exact
`assembly.cadassembly` alias accept the same optional fields:

| Prop | Input | Canonical parsed output | Omission |
| --- | --- | --- | --- |
| `cadPosition` | Object with all of `x`, `y`, `z`; finite mm numbers or existing distance-unit strings | Object with finite mm numbers | Remains absent; preserve the inherited origin |
| `cadRotation` | Object with all of `x`, `y`, `z`; finite degree numbers or signed numeric strings with `deg` or `rad` suffix | Object with finite degree numbers | Remains absent; identity local rotation |

Strings may have surrounding whitespace. Angle strings accept decimal and
scientific notation; examples include `"-90deg"` and `"1.5707963267948966rad"`.
Unitless angle strings and directional suffixes such as `degcw` are rejected;
use a signed number or an explicit `deg`/`rad` string. No partial-axis defaults,
angle wrapping, aliases, scaling, reflection, or raw matrix escape hatch are
introduced. Coordinates are points, rotations are right-handed orientations,
and reference normals/tangents are directions rather than points.

The public `AssemblyPosition`, `AssemblyRotation`, `AssemblyPlacementProps`,
`AssemblyPlacementPropsInput`, and `assemblyPlacementProps` exports describe
this contract. Motors, screens, boards, the root device, and unnamespaced CAD
elements receive no new placement props in this initial change. Descendant
assembly elements still need to inherit the containing frame in core.

## Frame and composition contract for core

Use the existing right-handed assembly frame: +X right, +Y top, +Z above, in mm.
The child's local rigid transform is:

```text
childWorld = parentWorld * translate(cadPosition) * Rz(z) * Ry(y) * Rx(x)
```

The rightmost transform applies first. These are rotations about the fixed
local X, then Y, then Z axes, followed by translation in the parent frame.
Omitted placement uses the existing inherited assembly frame, including legacy
attachment origins; it does not reset the part to the world origin.

This frame moves the element's geometry, its named reference surfaces, and
descendant assembly frames together. PCB/schematic authoring coordinates retain
their existing meanings; this is not a new PCB layout operation.
`cadModel.positionOffset`, `rotationOffset`, model origin and model-unit scale
continue to align only the model inside the part frame. They neither move
children nor relocate child reference surfaces. Model alignment and assembly
placement may both be supplied and both apply; no input is rewritten.

The resolved frame must be used consistently for mounting, drawings, bounds,
explosions, and exports. Circuit JSON and GLB consumers should retain named
assembly hierarchy and local transforms instead of flattening away the
relationship. The serialization shape is a separate Circuit JSON change.

## Conflicts and migration

A face mount fixes a printed part's complete pose. Combining `mountedTo` with
either placement prop is rejected, even for an explicitly supplied zero pose.
Keep a required adjustment in the reference surface or put the mounted group
inside a positioned container. The same exclusivity is required if mounting
is extended to generic parts or subassemblies in a companion proposal.

Existing designs parse unchanged: no placement defaults are inserted and CAD
model offsets keep their behavior. To migrate manual gantry world positions,
place the moving parent once and express children relative to that origin.
Keep imported-model alignment in `cadModel` rather than promoting it to an
assembly transform. Require a supporting core version before adopting the new
props; older core implementations may ignore them.

## Acceptance cases for the core follow-up

These are required behavior tests, not claims that this props PR implements a
geometry engine:

1. Parent X = 100 plus child local X = 5 emits child world X = 105, both with
   and without a CAD model on the parent.
2. A parent translated by `[100, 0, 0]` and rotated +90 degrees about Z moves
   a child at `[5, 0, 0]` to `[100, 5, 0]`. Cover rotations about X and Y too.
3. Moving or rotating the bridge carries nested X/Z carriages, imported models,
   and a face-mounted clamp without world offsets in child reference surfaces.
4. A model offset changes the model's placement inside the part but does not
   change the reference-surface or child frame. Combined model and part
   transforms apply in the documented order.
5. JSON round trips, GLB, drawings, and exploded views preserve the same world
   placement and named hierarchy. Missing target faces and attachment cycles
   still produce readable errors.

The props tests validate units, finite values, omission, model-source
compatibility, the exact subassembly alias, and competing-placement rejection.
Full-assembly STEP export and exact curved-solid modeling remain separate
exporter/kernel concerns; no authoring prop here changes either capability.
