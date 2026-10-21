# Assembly drawing props specification

The `assemblyProps.drawing` and `assemblyProps.drawingview` schemas define the
proposed `<assembly.drawing>` and `<assembly.drawingview>` TSX elements. This package exports and validates props; registering the intrinsic
TSX elements, selecting circuit geometry and emitting drawing output require a
follow-up in core/exporters. This example describes the intended authoring API,
not an already supported core runtime feature.

```tsx
<assembly.drawing name="housing-drawing" target=".housing" width="210mm" height="297mm">
  <assembly.drawingview name="plan" direction="z+" width="80mm" height="60mm"
    x="-45mm" y="60mm" showHiddenEdges />
  <assembly.drawingview name="section-a" displayName="A–A" direction="x+"
    width="80mm" height="60mm" x="45mm" y="60mm" scale={0.5}
    section={{ axis: "x", offset: "5mm", keepSide: "less", hatchSpacing: "1mm" }} />
  <assembly.drawingview name="overview" direction="isometric" width="160mm" height="100mm"
    y="-50mm" />
</assembly.drawing>
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

These names replace the unreleased `<engineeringdrawing>` / `<engineeringview>`
proposal; those names and the former `style` prop are not exposed. There are no
aliases or conflicting alternate representations. Existing components are
unchanged. Projection is fixed to orthographic, so physical scale has one unambiguous meaning. Paper layout, drawing
titles, dimensions and section callout annotations remain downstream work.
