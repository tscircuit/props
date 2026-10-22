# Assembly drawing props specification

The `assemblyProps.drawing.page` and `assemblyProps.drawing.partview` schemas define the
proposed `<assembly.drawing.page>` and `<assembly.drawing.partview>` TSX elements. This package exports and validates props; registering the intrinsic
TSX elements, selecting circuit geometry and emitting drawing output require a
follow-up in core/exporters. This example describes the intended authoring API,
not an already supported core runtime feature.

```tsx
<assembly.drawing.page name="housing-drawing" width="210mm" height="297mm">
  <assembly.drawing.partview target=".housing" name="plan" direction="z+" width="80mm" height="60mm"
    x="-45mm" y="60mm" showHiddenEdges />
  <assembly.drawing.partview target=".housing" name="section-a" displayName="A–A" direction="x+"
    width="80mm" height="60mm" x="45mm" y="60mm" scale={0.5}
    section={{ axis: "x", offset: "5mm", keepSide: "less", hatchSpacing: "1mm" }} />
  <assembly.drawing.partview target=".housing" name="overview" direction="isometric" width="160mm" height="100mm"
    y="-50mm" />
</assembly.drawing.page>
```

All model coordinates use tscircuit CAD world coordinates, in mm with +Z up.
An axis direction names the side on which the observer sits, looking toward the
model center; the opposite sign gives the opposite view. Isometric observes from
positive X/Y/Z. For X/Y axis views, paper up is +Z; Z axis views use +Y up.
Renderers must convert these coordinates into their model coordinate system
(e.g. glTF +Y up) at the boundary, including section offsets and retained sides.

Drawing width/height and viewport width/height are required positive distances.
Numeric distances mean mm; unit strings parse to numeric mm. View x/y default to
zero, measured from the paper center, +X right and +Y up. All views are
orthographic. Scale is an optional positive finite model-to-paper ratio; omission
means automatic fit. At explicit scale, excess geometry is clipped to the viewport.

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
Projection is orthographic. Each part view selects its own geometry with `target`;
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
  <assembly.drawing.partview target=".housing" direction="z+" width="100mm" height="100mm" />
</assembly.drawing.page>
```

Specify either `size` or both custom `width`/`height`; combining them is an error. Standard dimensions resolve to numeric mm in parsed props. Orientation is only valid with a named size. Title blocks are optional page children; sheet counts must be positive integers and sheetNumber cannot exceed numberOfSheets. Dates remain caller-authored strings (no locale conversion). TSX registration/emission in core remains a follow-up.
