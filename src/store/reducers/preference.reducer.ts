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
      title: "pages:preference.setting.organization.title",
      description: "pages:preference.setting.organization.description",
      href: "asd",
      permissions: "any",
    },
    {
      icon: "vicon-key",
      title: "pages:preference.setting.privilege.title",
      description: "pages:preference.setting.privilege.description",
      href: "/apps/preference/gate-setting",
      permissions: "any",
    },
    {
      icon: "vicon-people",
      title: "pages:preference.setting.role.title",
      description: "pages:preference.setting.role.description",
      href: "/apps/preference/role",
      permissions: "any",
    },
    {
      icon: "vicon-profile",
      title: "pages:preference.setting.people.title",
      description: "pages:preference.setting.people.description",
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
