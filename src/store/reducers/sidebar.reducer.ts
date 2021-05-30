import {
  SIDEBAR_CHANGE_VARIANT,
  SIDEBAR_CLOSE,
  SIDEBAR_OPEN,
} from "../actions/sidebar.action";

export type SidebarAnchorType = "left";
export type SidebarVariantType = "permanent" | "persistent" | "temporary";

export interface ISidebarState {
  anchor: SidebarAnchorType;
  variant: SidebarVariantType;
  isOpen: boolean;
}

export interface ISidebarAction {
  type: string;
  payload: any;
}

export const sidebarOpenKey = "sidebar.open";
const isOpen = parseFloat(localStorage.getItem(sidebarOpenKey) || "1");

const initialState: ISidebarState = {
  anchor: "left",
  isOpen: isNaN(isOpen) ? false : Boolean(isOpen),
  variant: "persistent",
};

export const sidebar = function (
  state: ISidebarState = initialState,
  action: ISidebarAction
) {
  switch (action.type) {
    case SIDEBAR_CLOSE:
      return {
        ...state,
        isOpen: false,
      };
    case SIDEBAR_OPEN:
      return {
        ...state,
        isOpen: true,
      };
    case SIDEBAR_CHANGE_VARIANT:
      return {
        ...state,
        variant: action.payload,
      };
    default:
      return state;
  }
};
