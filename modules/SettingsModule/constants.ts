// ===========================================================================
// Settings — constants owned by this module.
//
// Filter options and status vocabularies belong with the screen that renders
// them. Only cross-cutting constants stay in types/constants.ts.
// ===========================================================================

export const SETTINGS_TABS = [
  { id: "general", label: "General", icon: "settings" },
  { id: "team", label: "Team", icon: "users" },
  { id: "branding", label: "Branding", icon: "diamond" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
] as const;
