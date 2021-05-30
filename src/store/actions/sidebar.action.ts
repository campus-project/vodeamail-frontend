import {
  ISidebarAction,
  SidebarVariantType,
} from "../reducers/sidebar.reducer";

export const SIDEBAR_OPEN = "[SIDEBAR] OPEN";
export const SIDEBAR_CLOSE = "[SIDEBAR] CLOSE";
export const SIDEBAR_CHANGE_VARIANT = "[SIDEBAR] CHANGE VARIANT";

export const setSidebarOpen = (): ISidebarAction => {
  return {
    type: SIDEBAR_OPEN,
    payload: true,
  };
};

export const setSidebarClose = (): ISidebarAction => {
  return {
    type: SIDEBAR_CLOSE,
    payload: false,
  };
};

export const changeSidebarVariant = (
  payload: SidebarVariantType
): ISidebarAction => {
  return {
    type: SIDEBAR_CHANGE_VARIANT,
    payload,
  };
};
