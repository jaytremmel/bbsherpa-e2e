# Checklist

The gameday checklist at `/checklist`. Items are grouped by category.
Checked items persist in the browser's localStorage; filters do not.

- CL-1: WHEN a user checks an item, THE SYSTEM SHALL show it as checked.
- CL-2: WHEN a user reloads the page, THE SYSTEM SHALL keep checked items checked.
- CL-3: WHEN a user unchecks an item and reloads, THE SYSTEM SHALL show it as unchecked.
- CL-4: WHEN a user checks or unchecks items, THE SYSTEM SHALL update the progress line "{checked} of {total} items packed" to match.
- CL-5: WHEN at least one item is checked, THE SYSTEM SHALL show a Reset control; WHEN nothing is checked, THE SYSTEM SHALL hide it.
- CL-6: WHEN a user activates Reset, THE SYSTEM SHALL uncheck every item.
- CL-7: WHEN a user enables the Tailgating, Cold Game, or Kids filter, THE SYSTEM SHALL show that situation's extra items, and hide them again when the filter is disabled.
- CL-8: WHEN the page is opened with `?tailgate=true`, `?cold=true`, or `?kids=true`, THE SYSTEM SHALL start with that filter enabled.
