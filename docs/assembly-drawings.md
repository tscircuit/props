# Assembly drawing props specification

The `assemblyProps.drawing.page` and `assemblyProps.drawing.partview` schemas define the
proposed `<assembly.drawing.page>` and `<assembly.drawing.partview>` TSX elements. This package exports and validates props; registering the intrinsic
TSX elements, selecting circuit geometry and emitting drawing output require a
follow-up in core/exporters. This example describes the intended authoring API,
not an already supported core runtime feature.

```tsx
<assembly.drawing.page name="housing-drawing" width="210mm" height="297mm">
  <assembly.drawing.partview
    partRef=".housing"
    name="plan"
    direction="z+"
    width="80mm"
    height="60mm"
    centerX="-45mm"
    centerY="60mm"
    showHiddenEdges
  />
  <assembly.drawing.partview
    partRef=".housing"
    name="section-a"
    displayName="A–A"
    direction="x+"
    width="80mm"
    height="60mm"
    centerX="45mm"
    centerY="60mm"
    section={{
      axis: "x",
      offset: "5mm",
      keepSide: "less",
      hatchSpacing: "1mm",
    }}
  />
  <assembly.drawing.partview
    partRef=".housing"
    name="overview"
    direction="isometric"
    width="160mm"
    height="100mm"
    centerY="-50mm"
  />
</assembly.drawing.page>
```

All model coordinates use tscircuit CAD world coordinates, in mm with +Z up.
An axis direction names the side on which the observer sits, looking toward the
model center; the opposite sign gives the opposite view. Isometric observes from
positive X/Y/Z. For X/Y axis views, paper up is +Z; Z axis views use +Y up.
Renderers must convert these coordinates into their model coordinate system
(e.g. glTF +Y up) at the boundary, including section offsets and retained sides.

Drawing width/height and viewport width/height are required positive distances.
Numeric distances mean mm; unit strings parse to numeric mm. View centerX/centerY default to
zero on axes without a relative reference, measured from the paper center, +X right and +Y up. All views are
orthographic and automatically fit the selected geometry to the viewport.

Part views can infer placement from sibling views on the same page:

```tsx
<assembly.drawing.page size="iso_a4">
  <assembly.drawing.partview
    partRef=".housing"
    name="plan"
    direction="z+"
    width="80mm"
    height="60mm"
  />
  <assembly.drawing.partview
    partRef=".housing"
    name="side"
    direction="x+"
    width="80mm"
    height="60mm"
    rightOfRef=".plan"
  />
  <assembly.drawing.partview
    partRef=".housing"
    name="overview"
    direction="isometric"
    width="80mm"
    height="60mm"
    belowRef=".plan"
  />
</assembly.drawing.page>
```

`leftOfRef`/`rightOfRef` infer the horizontal center; `aboveRef`/`belowRef`
infer the vertical center. Each accepts a nonempty selector string (outer whitespace
is trimmed) identifying exactly one sibling part view. References describe viewport
placement, not model geometry. Inferred centers place the corresponding viewport
edges adjacent: horizontal center separation is half the sum of viewport widths;
vertical separation is half the sum of heights. There is no implicit gap.
An unconstrained axis defaults to zero; it does not inherit the referenced center.
For an offset reference, use an explicit center on the other axis or a second reference.

Opposing references on the same axis are mutually exclusive. An explicit `centerX`
conflicts with either horizontal reference, including an explicit zero; likewise
`centerY` conflicts with either vertical reference. A horizontal and vertical reference
can be combined, and explicit positioning on the other axis is allowed. Parsed props
retain the selectors and leave inferred centers undefined for downstream layout.
The props schema validates these local constraints; resolving names, forward
references, missing/ambiguous targets, self-references and dependency cycles requires
page-aware layout in core/exporters and remains follow-up work.

Views use outline rendering, with opaque white surfaces, black visible boundary,
crease and silhouette edges, and omitted hidden edges. `showHiddenEdges` enables
dashed obscured edges. There is no `style` prop. Future multiword enum values use
snake_case; signed axis literals retain the existing CAD axis notation.

A section requires an axis, finite offset and explicit retained side. `less` keeps
coordinates <= offset; `greater` keeps >= offset. Closed cut faces use diagonal
45-degree hatching; cavities stay empty and open surfaces cannot be capped.
Hatch spacing defaults to 1mm in model space and must be positive. Hatching follows
any model-to-paper scaling. Hidden edges apply to the retained section geometry.

These are new, unreleased components; no aliases or migration behavior are provided.
Use `partRef` to select geometry and `centerX`/`centerY` to position the viewport;
`target`, `x`, `y`, and `scale` are not supported props. Unknown keys are stripped
by the schema rather than treated as aliases. A nonempty `partRef` is required,
and viewport centers accept finite numeric mm or unit strings.
Projection is orthographic. Each part view selects its own geometry with `partRef`;
a page only describes paper layout. There are no image URLs or generated asset
records in the drawing configuration. Core resolves selectors to Circuit JSON
source IDs. Dimension annotations remain downstream work.

## Standard references

Named sheet sizes use `iso_a0`–`iso_a4` and `ansi_a`–`ansi_e`, with `landscape` (default) or `portrait` orientation. Custom pages retain explicit width and height. Dimensions are always mm; ANSI inch dimensions are converted exactly using 25.4 mm/in (ANSI A is 279.4 × 215.9 mm in landscape).

- [ISO 5457:1999](https://www.iso.org/standard/29017.html): drawing-sheet sizes and layout.
- [ASME Y14.1](https://www.asme.org/codes-standards/find-codes-standards/drawing-sheet-size-and-format): metric and decimal-inch drawing sheets.
- [Autodesk Fusion sheet-size reference](https://help.autodesk.com/cloudhelp/ENU/Fusion-Drawing/files/DWG-REF-SHEET-SIZE.htm): interoperable ISO A0–A4 and ANSI A–E dimensions.
- [ISO 7200:2004](https://www.iso.org/standard/35446.html): title-block and document-header data fields.

These references guide sizes and metadata terminology. This proposal does not claim complete ISO/ASME template compliance or prescribe a projection method. Sheet orientation does not rotate model views.

```tsx
<assembly.drawing.page name="housing" size="iso_a4" orientation="landscape">
  <assembly.drawing.titleblock
    title="Housing"
    identificationNumber="H-001"
    revisionIndex="A"
    legalOwner="Example Ltd"
    creator="Designer"
    sheetNumber={1}
    numberOfSheets={1}
  />
  <assembly.drawing.partview
    partRef=".housing"
    direction="z+"
    width="100mm"
    height="100mm"
  />
</assembly.drawing.page>
```

Specify either `size` or both custom `width`/`height`; combining them is an error. Standard dimensions resolve to numeric mm in parsed props. Orientation is only valid with a named size. Title blocks are optional page children; sheet counts must be positive integers and sheetNumber cannot exceed numberOfSheets. Dates remain caller-authored strings (no locale conversion). TSX registration/emission in core remains a follow-up.

## Dimension intent from model features or view extents

`assemblyProps.drawing.dimension` validates the proposed
`<assembly.drawing.dimension>` child of a part view. Its only props are optional
`name` and exactly one target: `edgeRef`, `widthOfView={true}`, or
`heightOfView={true}`. `name` is stable circuit identity; it does not choose an
axis, placement or text formatting. This package validates authoring intent.
Registering the TSX element and resolving dimensions in core remain follow-up work.

Name the extrusion's actual cap outlines in the model's Fiber TSX. A sharp
40 × 20 × 80 mm tube with 3 mm walls can declare its outer and bore outlines
where those shapes are constructed:

```tsx
import { ExtrudeLinear, Rectangle, Subtract } from "jscad-fiber/model";

function TubeModel() {
  return (
    <Subtract>
      <ExtrudeLinear
        height={80}
        topOutlineName="outer_top"
        bottomOutlineName="outer_bottom"
      >
        <Rectangle size={[40, 20]} />
      </ExtrudeLinear>
      <ExtrudeLinear
        height={80}
        topOutlineName="inner_top"
        bottomOutlineName="inner_bottom"
      >
        <Rectangle size={[34, 14]} />
      </ExtrudeLinear>
    </Subtract>
  );
}
```

The extrusion supplies the native closed profile and its end placement. Names
are nonblank and unique within a model. `bottomOutlineName` identifies the authored
start at local Z=0; `topOutlineName` identifies the signed-height end, including
any extrusion twist in radians. Enclosing center/offset and rotations place the
outline alongside the solid. Names identify construction features before later
booleans. The model does not author duplicate edge coordinates or a separate
feature map.

The companion [Fiber proposal](https://github.com/tscircuit/jscad-fiber/pull/142)
collects native geometry and full 4×4 column-major placement matrices through
`renderToJscadModel`. The [JSCAD tube proposal](https://github.com/tscircuit/jscad-electronics/pull/504)
uses the same registered component for its convenience constructor. These features
remain owned by the model. The closed `outer_top` spans 40 mm horizontally and
the closed `inner_top` bore spans 34 mm; those spans are neither straight edges
nor perimeter lengths.

The intended drawing authoring API selects the model feature:

```tsx
// The model defining .tube declares topOutlineName="inner_top".
<assembly.drawing.partview
  partRef=".tube"
  name="end-view"
  direction="z+"
  width="100mm"
  height="80mm"
>
  <assembly.drawing.dimension name="bore-width" edgeRef=".tube > .inner_top" />
</assembly.drawing.partview>
```

`edgeRef` accepts a nonempty selector string and trims outer whitespace. It must
identify one model-defined named feature belonging to the part selected by the
enclosing view. Core will need to reject missing or ambiguous targets. A string
such as `overall_width` does not manufacture a feature. Names come from the
source model's available geometry, such as STEP topology/native labels,
producer-authored glTF metadata, or named JSCAD geometry. Mesh triangle indices
and B-rep ordering do not automatically become stable names.

Named geometry can include curved or closed outlines. Core's planned dimension
layout will infer an appropriate projected axis, witness points and line
placement from the selected geometry and view. The drawing does not specify
orientation or replace an outline with an authored two-point chord. The model
reader applies its collected placement and CAD instance placement when core
resolves the geometry; the props retain only the selector.

Use the boolean targets when the intent is the selected view geometry's overall
width or height:

```tsx
<assembly.drawing.partview
  partRef=".tube"
  name="end-view"
  direction="z+"
  width="100mm"
  height="80mm"
>
  <assembly.drawing.dimension name="overall-width" widthOfView />
  <assembly.drawing.dimension name="overall-height" heightOfView />
</assembly.drawing.partview>
```

These targets request physical model extents on the view's right/up axes,
independent of viewport width/height, pixel allocation or paper scaling.
A section view's requested extent concerns its retained geometry. Computing
those measurements and their paper placement is future core work.

Exactly one target must be selected. `false` does not select a boolean target:
`edgeRef` with `widthOfView={false}` is allowed, while both booleans false
without an edge is invalid. An edge plus a true boolean, or both booleans true,
is invalid. Canonical parsed props preserve the trimmed selector, supplied
boolean flags and optional identity. There is no implicit target or layout
default.

The proposed resolved Circuit JSON output is `drawing_dimension_line`.
Core will produce its required `start` and `end` line endpoints in
page-centered paper mm (+X right, +Y up), plus required `text` containing the
preformatted measurement. Optional `edge_ref_start` and `edge_ref_end` are
paper-space witness points, and optional `edge_ref_name` is the exact source
feature name, such as `inner_top`. These are resolved drawing fields, not TSX
dimension props. The exporter consumes the resulting paper primitives directly.
No native edge geometry or universal topology schema is serialized into the
drawing record. Emitting these resolved records and choosing their text and
placement remain future core responsibilities.

This unreleased props API removes `orientation`, `offset` and `precision`.
They have no aliases or migration shims and are not offered by the exported
types. Remove them from drawing TSX. As with other props objects, unknown keys
are stripped by the runtime schema; they never enter canonical parsed dimension
props. Measurement values, formatted text, endpoint coordinates and witness
points are also outside the authoring props. Circular, radial, angular,
toleranced and GD&T annotations remain outside this initial proposal.
