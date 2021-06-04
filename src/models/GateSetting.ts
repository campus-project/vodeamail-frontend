import { Role } from "./Role";
import { Permission } from "./Permission";

export interface GateSetting {
  id?: string;
  name: string;
  valid_from: string | Date | null;
  role_id: string | Role | null;
  permission_ids: string[] | Permission[] | null;

  role?: Role;
  permissions?: Permission[];
}
