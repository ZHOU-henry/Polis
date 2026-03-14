import { cookies } from "next/headers";

export const accessRoleCookieName = "agora-access-role";
export const accessRoles = ["customer", "builder", "ops"] as const;
export type AccessRole = (typeof accessRoles)[number];

export function normalizeAccessRole(value: string | null | undefined): AccessRole {
  if (value === "builder" || value === "ops") {
    return value;
  }

  return "customer";
}

export function getAccessRoleRedirectPath(role: AccessRole) {
  switch (role) {
    case "builder":
      return "/builders";
    case "ops":
      return "/ops";
    default:
      return "/customer";
  }
}

export async function getAccessRole(): Promise<AccessRole> {
  const cookieStore = await cookies();
  return normalizeAccessRole(cookieStore.get(accessRoleCookieName)?.value);
}
