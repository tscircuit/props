# Panel tooling rails

`<toolingrail panelSide="left" width="5mm">` identifies usable material within existing panel edge padding. `panelSide` is required (`top`, `right`, `bottom`, `left`); `width` is a finite positive distance, with numeric values in mm. There are no aliases or manufacturing defaults.

A tooling rail must be a direct `<panel>` child, and its width must fit in the panel's edge padding on the selected side. Children use the rail's local centre as their origin (+X right, +Y up, mm), so existing `<hole>`, `<fiducial>`, and `<silkscreentext>` elements can use ordinary scalar placement attributes. The rail itself does not enlarge the panel or add padding. No nested JSON configuration is introduced.
