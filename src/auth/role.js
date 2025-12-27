export const ROLE_HIERARCHY = {
  SPOC: ["SPOC", "CALENDAR_TEAM", "ADMIN"],
  CALENDAR_TEAM: ["CALENDAR_TEAM", "ADMIN"],
  ADMIN: ["ADMIN"],
};

export const hasAccess = (userRole, requiredRole) =>
  ROLE_HIERARCHY[requiredRole]?.includes(userRole);
