# Finished panel size limits

Assembly lines have minimum sizes for conveyor/fixture engagement and maximum travel/fixture dimensions. `minWidth`, `maxWidth`, `minHeight`, and `maxHeight` are optional scalar attributes on the root `<panel>` for these equipment limits. They are finite positive distances, with numeric values in mm; minimum must not exceed maximum. There are no default equipment limits or aliases.

The limits apply to the finished outer panel, including edge padding, and they shape a grid layout:

- When rows, columns and panel dimensions are left to the layout, a grid that would exceed `maxWidth` or `maxHeight` is rearranged into the smallest grid of rows and columns that fits.
- An auto-sized panel smaller than `minWidth` or `minHeight` grows to it, keeping its boards centred.
- A limit that no layout can meet, or that explicit panel dimensions break, is reported as a placement error.

Limits are rejected on a nested subpanel.

```tsx
<panel layoutMode="grid" maxWidth="30mm" minHeight="100mm">
  <board width="14mm" height="18mm" />
  <board width="14mm" height="18mm" />
  <board width="14mm" height="18mm" />
  <board width="14mm" height="18mm" />
</panel>
```

With the default 5 mm edge padding, these four boards would form a 2 by 2 grid in a 40 by 48 mm panel. `maxWidth="30mm"` makes them a single column, 24 mm wide, and `minHeight="100mm"` grows the panel to 100 mm tall. These illustrative numbers are not fabrication defaults.

This feature is independent of tabs, rails, fixtures, V-score, and silkscreen.
