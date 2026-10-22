# Assembly drawing props specification

The `assemblyProps.drawing.page` and `assemblyProps.drawing.partview` schemas define the
proposed `<assembly.drawing.page>` and `<assembly.drawing.partview>` TSX elements. This package exports and validates props; registering the intrinsic
TSX elements, selecting circuit geometry and emitting drawing output require a
follow-up in core/exporters. This example describes the intended authoring API,
not an already supported core runtime feature.

```tsx
<assembly.drawing.page name="housing-drawing" width="210mm" height="297mm">
  <assembly.drawing.partview partRef=".housing" name="plan" direction="z+" width="80mm" height="60mm"
    centerX="-45mm" centerY="60mm" showHiddenEdges />
  <assembly.drawing.partview partRef=".housing" name="section-a" displayName="A–A" direction="x+"
    width="80mm" height="60mm" centerX="45mm" centerY="60mm"
    section={{ axis: "x", offset: "5mm", keepSide: "less", hatchSpacing: "1mm" }} />
  <assembly.drawing.partview partRef=".housing" name="overview" direction="isometric" width="160mm" height="100mm"
    centerY="-50mm" />
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
  <assembly.drawing.partview partRef=".housing" name="plan" direction="z+"
    width="80mm" height="60mm" />
  <assembly.drawing.partview partRef=".housing" name="side" direction="x+"
    width="80mm" height="60mm" rightOfRef=".plan" />
  <assembly.drawing.partview partRef=".housing" name="overview" direction="isometric"
    width="80mm" height="60mm" belowRef=".plan" />
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
  <assembly.drawing.titleblock title="Housing" identificationNumber="H-001"
    revisionIndex="A" legalOwner="Example Ltd" creator="Designer"
    sheetNumber={1} numberOfSheets={1} />
  <assembly.drawing.partview partRef=".housing" direction="z+" width="100mm" height="100mm" />
</assembly.drawing.page>
```

Specify either `size` or both custom `width`/`height`; combining them is an error. Standard dimensions resolve to numeric mm in parsed props. Orientation is only valid with a named size. Title blocks are optional page children; sheet counts must be positive integers and sheetNumber cannot exceed numberOfSheets. Dates remain caller-authored strings (no locale conversion). TSX registration/emission in core remains a follow-up.

## Linear dimensions from model edges or view geometry

`assemblyProps.drawing.dimension` validates the proposed
`<assembly.drawing.dimension>` child of a part view. Select exactly one target:
`edgeRef`, `widthOfView={true}`, or `heightOfView={true}`. Dimensions measure the
selected geometry; they do not author a replacement numeric value or move it.
Core registration and reference resolution remain follow-up work.

A reference points to an edge actually exported by the model. For example, the
rectangular-tube model's `.drawing().namedEdges` metadata defines named straight
segments such as `outer_top`, with model-local `start` and `end` points. Core can
expose those model-defined edges under the part identity:

```tsx
// The model defining .tube exports a named edge with name: "outer_top".
// Its endpoints come from the model's geometry/parameters, not this drawing.
<assembly.drawing.partview partRef=".tube" name="end-view" direction="z+"
  width="100mm" height="80mm">
  <assembly.drawing.dimension name="top-edge" edgeRef=".tube > .outer_top"
    offset="-8mm" />
</assembly.drawing.partview>
```

`edgeRef` is a nonempty selector string (outer whitespace is trimmed). It must
resolve to one model-defined named edge belonging to the part selected by the
enclosing view. Missing or ambiguous selectors are core errors. There is no
preset lookup: a string such as `overall_width` does not manufacture an edge.
The props schema preserves the selector; Circuit JSON stores the resolved
`cad_named_edge_id` with its `drawing_part_view_id`.

Named edges are authored analytic segments or measurement datums whose names
remain independent of mesh triangle indices and B-rep ordering. A model may
explicitly define a nominal envelope datum for a rounded part; the drawing must
still reference that exported definition. Model-local points use CAD mm (+Z up).
Core must apply the same model-to-world transform as the geometry before
emitting `cad_named_edge` endpoints.

Use an explicit boolean target when the intent is an inferred overall size:

```tsx
<assembly.drawing.partview partRef=".tube" name="end-view" direction="z+"
  width="100mm" height="80mm">
  <assembly.drawing.dimension widthOfView offset="-8mm" />
  <assembly.drawing.dimension heightOfView offset="8mm" />
</assembly.drawing.partview>
```

`widthOfView` measures the selected geometry's extent on the view's model-space
right axis; `heightOfView` measures its extent on the up axis. These are physical
model measurements in mm, independent of viewport width/height, pixel allocation,
or paper scale. For a section view, extents come from the section's retained
geometry. No edge reference or synthetic named edge is required for either mode.

Exactly one target must be selected. `false` does not select a boolean target:
`edgeRef` with `widthOfView={false}` is allowed; both booleans false without an
edge is invalid. An edge plus a true boolean, or both booleans true, is invalid.
View extent modes infer `horizontal` or `vertical` orientation respectively;
passing an explicit `orientation`, even the matching one, is an error.

For named-edge dimensions only, `orientation` accepts `horizontal`, `vertical`,
or `aligned` (default). Aligned measures the true 3D segment length; horizontal
and vertical measure its component on the view's right/up axes. A section cut
does not redefine the referenced segment. Canonical parsed props contain the
resolved orientation while preserving the selector or boolean target.

`offset` accepts a finite signed numeric distance in paper mm or a unit string
and defaults to 8mm. Positive/negative offsets select opposite sides of the
projected dimension line. It is not model-space clearance. `precision` is an
integer from 0 through 6 (default 1) controlling decimal places in the measured
mm value. There are no aliases or numeric/text overrides; unknown keys are
stripped rather than interpreted as aliases. Circular, radial, angular,
toleranced, and GD&T annotations remain outside this initial linear contract.
References: [AutoCAD aligned dimensions](https://help.autodesk.com/cloudhelp/2027/ENG/AutoCAD-Core/files/GUID-D7C05A85-8985-4576-B22C-5A795DD5B179.htm)
and [FreeCAD TechDraw length dimensions](https://github.com/FreeCAD/FreeCAD-documentation/blob/main/wiki/TechDraw_LengthDimension.md)
provide conventional geometry-linked dimension terminology; this proposal does
not claim full standards compliance.
