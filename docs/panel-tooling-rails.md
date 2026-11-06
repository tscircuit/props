# Panel tooling rails

`<toolingrail side="left" width="5mm">` identifies usable material within existing panel edge padding. `side` is required (`top`, `right`, `bottom`, `left`); `width` is a finite positive distance, with numeric values in mm. There are no aliases or manufacturing defaults.

Core's `Toolingrail` resolves the strip dimensions, rejects widths exceeding the selected padding, and supplies a local centre transform (+X right, +Y up, mm). It must be a direct `<panel>` child. Existing `<hole>`, `<fiducial>`, and `<silkscreentext>` children can then use ordinary scalar placement attributes when their separate panel-support features are merged. The rail itself does not enlarge the panel or add padding. No nested JSON configuration is introduced.
