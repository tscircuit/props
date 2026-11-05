# Panel V-score intent

`panelizationMethod="v_score"` is the canonical opt-in enum value; there is no hyphenated alias and omission retains the existing default. Core defaults the V-score board gap to zero and rejects a nonzero gap, nonrectangular boards, or use on a nested subpanel.

Core's `generatePanelVScoreAnnotations` emits labelled panel-owned fabrication paths across straight board boundaries. It does not route slots, prescribe scoring depth, or generate machine-specific instructions. The separate circuit-json panel-owner schema and Core implementation must publish before this prop produces output.
