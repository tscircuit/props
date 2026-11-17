# Laser engraving on part surfaces

This proposal adds a `manufacturing` namespace with two elements,
`manufacturing.laserengraving.text` and `manufacturing.laserengraving.image`.
They are children of `assembly.printedpart` or `assembly.part` and place a
laser-engraved mark on one surface of that part. Resolving surfaces, emitting
circuit-json and rendering require the matching core implementation.

## Problem

A part can carry a logo, a revision or a serial number, and today there is no
way to author one. A generic "texture" or "decal" prop would describe how the
part looks without saying how the mark is made, so it could not drive a laser
job or a manufacturing drawing. Elements are therefore named for the process.

```tsx
<assembly.printedpart name="LID" jscad={<Lid />} material="petg">
  <assembly.referencesurface
    name="badge"
    plane="xz"
    outwardNormal="y-"
    centerYOffset="-25mm"
    centerZOffset="6mm"
    width="30mm"
    height="8mm"
  />

  <manufacturing.laserengraving.text
    text="REV B"
    surfaceRef="topSurface"
    fontSize="3mm"
    distanceFromSurfaceLeftEdge="4mm"
    distanceFromSurfaceTopEdge="4mm"
  />

  <manufacturing.laserengraving.image
    imageUrl="./logo.svg"
    surfaceRef="topSurface"
    width="18mm"
    yOffsetFromSurfaceCenter="-6mm"
    rotationOnSurface="90deg cw"
  />

  <manufacturing.laserengraving.text
    text="SN 0001"
    surfaceRef="badge"
    fontSize="2.5mm"
  />
</assembly.printedpart>
```

## Choosing the surface

`surfaceRef` is required. It is either a built-in bounding surface or the name of
a reference surface on the parent part: an `assembly.referencesurface` child or
a named JSCAD reference rectangle.

Built-in surfaces come from the part's model bounds, in its local right-handed
XYZ. The four sides are upright, so text on a wall reads the right way up.

| `surfaceRef` | Outward normal | Surface +X | Surface +Y |
| --- | --- | --- | --- |
| `topSurface` | `z+` | `x+` | `y+` |
| `bottomSurface` | `z-` | `x+` | `y-` |
| `frontSurface` | `y-` | `x+` | `z+` |
| `backSurface` | `y+` | `x-` | `z+` |
| `rightSurface` | `x+` | `y+` | `z+` |
| `leftSurface` | `x-` | `y-` | `z+` |

A named reference surface keeps the frame it was authored with. Its
`outwardNormal` is the side the mark is engraved on and seen from, +X is its
in-plane X direction and +Y its second tangent. That second tangent can point
along part -Z (an `xz` surface with `outwardNormal="y+"`), in which case the
author turns the mark with `rotationOnSurface="180deg"`.

## Reference surface `outwardNormal`

`assembly.referencesurface` gains `outwardNormal`, the direction a surface
faces. It accepts `x+`, `x-`, `y+`, `y-`, `z+` or `z-`, must be perpendicular
to `plane`, and uses the existing per-plane default when omitted.

`normalDirection` remains as an alias with the same meaning. Either name may
be used; giving both with different values is rejected. Parsed output always
carries both names with the same value, so consumers can read either. No
migration is required.

## Positioning on the surface

Positions are in the surface frame, seen from outside the part: "left" is -X
and "top" is +Y. Choose at most one prop per axis. An axis with none is
centered on the surface.

| Axis | Prop | Meaning |
| --- | --- | --- |
| X | `xOffsetFromSurfaceCenter` | Signed distance from the surface center to the mark's anchor point |
| X | `distanceFromSurfaceLeftEdge` | Gap between the surface's left edge and the mark's left edge |
| X | `distanceFromSurfaceRightEdge` | Gap between the surface's right edge and the mark's right edge |
| Y | `yOffsetFromSurfaceCenter` | Signed distance from the surface center to the mark's anchor point |
| Y | `distanceFromSurfaceTopEdge` | Gap between the surface's top edge and the mark's top edge |
| Y | `distanceFromSurfaceBottomEdge` | Gap between the surface's bottom edge and the mark's bottom edge |

`anchorAlignment` picks the point of the mark that center offsets locate. It
has no effect on an axis positioned from an edge.

`rotationOnSurface` turns the mark, seen from outside the part. It uses the
shared rotation parser: a number is degrees counterclockwise, and a string is
`"90deg"` or `"1.57rad"`, optionally followed by a direction, as in
`"90deg ccw"` or `"90deg cw"`. Without a direction it is counterclockwise.
Edge distances measure the rotated mark's bounds.

Edge distances need a surface with extents. Built-in surfaces take them from
the model bounds. A reference surface must declare `width` and `height`.

## Accepted inputs, output and defaults

Shared by both elements:

| Prop | Accepted input | Parsed output | Omission |
| --- | --- | --- | --- |
| `surfaceRef` | Nonblank string | Trimmed | Rejected |
| `xOffsetFromSurfaceCenter`, `yOffsetFromSurfaceCenter` | Signed finite mm number or distance string | Number in mm | Absent |
| `distanceFromSurface{Left,Right,Top,Bottom}Edge` | Finite nonnegative mm number or distance string | Number in mm | Absent |
| `anchorAlignment` | Nine-point anchor | Unchanged | `"center"` |
| `rotationOnSurface` | Finite degrees number, or `"<n>deg"`/`"<n>rad"` string with optional `ccw` or `cw` | Number in degrees counterclockwise; `"90deg cw"` parses to `-90` | Absent; no rotation |
| `name` | Nonblank string | Trimmed | Absent |
| `engravingDepth` | Finite positive mm number or distance string | Number in mm | Absent; no depth is assumed |
| `resultingColor` | Nonblank string | Trimmed | Absent; the renderer derives it |

`manufacturing.laserengraving.text`:

| Prop | Accepted input | Parsed output | Omission |
| --- | --- | --- | --- |
| `text` | String that is not blank | Unchanged | Rejected |
| `fontSize` | Finite positive mm number or distance string | Number in mm | Rejected; no size is assumed |
| `font` | `"tscircuit2024"` | Unchanged | Absent |
| `textStyle` | `"filled"` or `"outline"` | Unchanged | Absent |

`manufacturing.laserengraving.image`:

| Prop | Accepted input | Parsed output | Omission |
| --- | --- | --- | --- |
| `imageUrl` | Nonempty URL string or static-file import | String | Rejected |
| `width`, `height` | Finite positive mm number or distance string | Number in mm | One may be absent and follows the aspect ratio; both absent is rejected |
| `rasterMode` | `"threshold"`, `"dither"` or `"grayscale"` | Unchanged | Absent; does not apply to vector images |
| `invertImage` | Boolean | Unchanged | Absent |

There are no aliases. The only parsed default is `anchorAlignment`.

## Conflicts and compatibility

- Two position props on one axis are rejected, with the issue on the second.
- A rotation string that is not a number with an optional `deg`/`rad` unit and
  an optional `ccw`/`cw` direction is rejected, so a misspelled direction
  cannot silently rotate the wrong way. This parser is shared with
  `pcbRotation`, `schRotation`, `schematicrect`'s `rotation` and the KiCad
  footprint `rotation`, which previously ignored a direction and accepted any
  string. Bend angles, arc angles and source phases are angles, not rotations,
  and keep the previous parser.
- Negative edge distances are rejected. A mark that should overhang an edge is
  positioned from the center.
- Apart from the rotation parser above, the API is additive. Existing parts
  and reference surfaces parse as before. `assembly.part` and
  `assembly.printedpart` already accept children; old core versions ignore the
  new elements.
- These elements describe one manufacturing step on a part. They add no BOM
  line and no mounting behavior, and they do not change the part's geometry
  source.

## Acceptance cases for core and consumers

1. A mark on each built-in surface lands on the correct side with the frame in
   the table above, and reads correctly from outside the part.
2. A mark on a named reference surface follows that surface through the part's
   mount, including nonzero roll.
3. Edge distances on a reference surface without `width` and `height`, a
   missing or ambiguous surface name, and a mark placed outside any part fail
   with readable names. A mark that exceeds its surface is reported.
4. Built-in surfaces need the part's bounds. Imported models have
   `modelBounds`; `jscad` parts are currently emitted as a plan without
   evaluating geometry, so core must either evaluate bounds or leave built-in
   surfaces for the consumer to resolve.
5. Viewers draw the mark on the part, and an exporter can produce the artwork
   for one surface in that surface's frame.

The props suite covers parsing, defaults and the one-position-per-axis rule
for both elements. The cases above need core tests.

## Open questions

- **"Top" means +Z here.** Board edges use `topedge` for +Y, and the
  face-mounting proposal describes +Y as "top" and +Z as "above". If that is
  confusing, the alternative is `aboveSurface`/`belowSurface`.
- **Machine settings.** Laser power, speed and pass count are left out because
  they depend on the machine and material.
- **Other processes.** Printed marks could reuse the surface placement props
  under their own process name. A sticker has thickness and a BOM line, so it
  fits better as an assembly part mounted with `mountedTo`.
