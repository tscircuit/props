# Finished panel size validation

Assembly lines have minimum sizes for conveyor/fixture engagement and maximum travel/fixture dimensions. `minWidth`, `maxWidth`, `minHeight`, and `maxHeight` are optional scalar attributes on the root `<panel>` for these equipment-specific checks. They are finite positive distances, with numeric values in mm; minimum must not exceed maximum. There are no default equipment limits or aliases.

Core's `Panel.doInitialPanelLayout` checks the finished outer dimensions, including edge padding, and emits placement errors. It does not resize, repack, or silently grow the panel. Core rejects limits on a nested subpanel. For example a 60 by 40 mm board with 5 mm padding produces a 70 by 50 mm panel; bounds of minWidth 50 mm and maxWidth 250 mm accept that width. These illustrative numbers are not fabrication defaults.

```tsx
<panel layoutMode="grid" edgePadding="5mm" minWidth="50mm" maxWidth="250mm">
  <board width="60mm" height="40mm" />
</panel>
```

Props validates input; only the separate Core implementation checks rendered dimensions. This feature is independent of tabs, rails, fixtures, V-score, and silkscreen.
