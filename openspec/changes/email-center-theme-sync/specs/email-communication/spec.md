## MODIFIED Requirements

### Requirement: Email Interface Visual Customization
The standalone Email Center client SHALL match the selected visual interface theme class (midnight, light, or sunset) on startup and update dynamically when changes occur in the parent document container.

#### Scenario: Verify Realtime Theme Sync in Embedded Email Center
- **WHEN** the administrator toggles the active theme dropdown in the System Settings
- **THEN** the system SHALL propagate a postMessage theme update to the Email Center iframe
- **AND** the Email Center document SHALL apply the matching CSS theme class immediately
