import { MENU_INIT } from "../actions/menu.action";

export interface IMenu {
  label: string;
  href: string;
  icon: string;
  permissions: string | string[];
  otherUrls?: string[];
  children?: ISubMenu[];
}

export interface ISubMenu {
  label: string;
  href: string;
  otherUrls?: string[];
}

export interface IMenuState {
  items: IMenu[];
}

export interface IMenuAction {
  type: string;
  payload: any;
}

const initialState: IMenuState = {
  items: [
    {
      label: "Dashboard",
      href: "/apps/dashboard",
      icon: "vicon-dashboard",
      permissions: "any",
    },
    {
      label: "Campaign",
      href: "/apps/campaign",
      icon: "vicon-megaphone",
      permissions: "any",
      otherUrls: [
        "/apps/campaign/campaign/create",
        "/apps/campaign/campaign/:slug/update",
        "/apps/campaign/email-template/create",
        "/apps/campaign/email-template/:slug/update",
      ],
      children: [
        {
          label: "Email Campaign",
          href: "/apps/campaign/email-campaign",
          otherUrls: [
            "/apps/campaign/campaign/create",
            "/apps/campaign/campaign/:slug/update",
          ],
        },
        {
          label: "Email Template",
          href: "/apps/campaign/email-template",
        },
      ],
    },
    {
      label: "Audience",
      href: "/apps/audience",
      icon: "vicon-people",
      permissions: "any",
      otherUrls: [
        "/apps/audience/contact/create",
        "/apps/audience/contact/:slug/update",
        "/apps/audience/group/create",
        "/apps/audience/group/:slug/update",
      ],
    },
    {
      label: "Analytic",
      href: "/apps/analytic",
      icon: "vicon-graph",
      permissions: "any",
      otherUrls: ["/apps/analytic/email", "/apps/analytic/email/:slug"],
    },
    {
      label: "Preference",
      href: "/apps/preference",
      icon: "vicon-adjust",
      permissions: "any",
      otherUrls: [
        "/apps/preference/organization",
        "/apps/preference/role",
        "/apps/preference/role/create",
        "/apps/preference/role/:slug/update",
        "/apps/preference/gate-setting",
        "/apps/preference/gate-setting/create",
        "/apps/preference/gate-setting/:slug/update",
        "/apps/preference/team",
        "/apps/preference/team/create",
        "/apps/preference/team/:slug/update",
      ],
    },
  ],
};

export const menu = function (
  state: IMenuState = initialState,
  action: IMenuAction
) {
  switch (action.type) {
    case MENU_INIT:
      //todo: compare permissions
      return {
        ...state,
      };
    default:
      return state;
  }
};
