import { PREFERENCE_INIT } from "../actions/preference.action";

export interface IPreference {
  icon: string;
  title: string;
  description: string;
  href: string;
  permissions: string | string[];
}

export interface IPreferenceState {
  items: IPreference[];
}

export interface IPreferenceAction {
  type: string;
  payload: any;
}

const initialState: IPreferenceState = {
  items: [
    {
      icon: "vicon-business",
      title: "Organization",
      description: "Setting your business or organization",
      href: "/apps/preference/organization",
      permissions: "any",
    },
    {
      icon: "vicon-key",
      title: "Permission",
      description: "Configure your role access for application",
      href: "/apps/preference/gate-setting",
      permissions: "any",
    },
    {
      icon: "vicon-people",
      title: "Role",
      description: "Setup your role for user privilege",
      href: "/apps/preference/role",
      permissions: "any",
    },
    {
      icon: "vicon-profile",
      title: "People",
      description: "Setting or update your team role of business",
      href: "/apps/preference/user",
      permissions: "any",
    },
  ],
};

export const preference = function (
  state: IPreferenceState = initialState,
  action: IPreferenceAction
) {
  switch (action.type) {
    case PREFERENCE_INIT:
      //todo: compare permissions
      return {
        ...state,
      };
    default:
      return state;
  }
};
