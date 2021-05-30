import { AUTH_SET_STATUS, AUTH_SET_USER } from "../actions/auth.action";
import { Role } from "../../models/Role";
import { Organization } from "../../models/Organization";

export interface IAuthAccount {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  permissions: string[];
  organization: Organization;
  role: Role;
}

export type AuthSeverityType = "success" | "info" | "warning" | "error";

export interface IAuthStatus {
  severity: AuthSeverityType;
  message: string;
}

export interface IAuthState {
  isLogged: boolean;
  user: IAuthAccount | null;
  status: IAuthStatus | null;
}

export interface IAuthAction {
  type: string;
  payload: any;
}

const initialState: IAuthState = {
  isLogged: false,
  user: null,
  status: null,
};

export const auth = function (
  state: IAuthState = initialState,
  action: IAuthAction
) {
  switch (action.type) {
    case AUTH_SET_USER:
      return {
        ...state,
        isLogged: !!action.payload,
        user: action.payload,
      };
    case AUTH_SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};
