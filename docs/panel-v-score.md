# Panel V-score

`vScore` is a boolean on `<panel>` and `<subpanel>`, next to `mouseBites`. Both describe how the tabs that hold boards in the panel are made breakable:

- `mouseBites` perforates each tab with a row of small holes.
- `vScore` V-scores the tabs instead.

They are alternatives. Mouse bites stay the default; setting `vScore` turns them off, so an omitted `mouseBites` parses as `false` when `vScore` is `true`. Only explicitly setting both `vScore` and `mouseBites` to `true` is a validation error. Omitting `vScore` keeps the existing behaviour.

```tsx
<panel panelizationMethod="tab-routing" vScore>
  <board width="20mm" height="20mm" />
  <board width="20mm" height="20mm" />
</panel>
```

`vScore` does not change `panelizationMethod`, and does not prescribe scoring depth or machine-specific settings.
