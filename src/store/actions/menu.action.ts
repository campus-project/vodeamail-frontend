import { IMenuAction } from "../reducers/menu.reducer";

export const MENU_INIT = "[MENU] INIT";

export const initMenu = (payload: string[]): IMenuAction => {
  return {
    type: MENU_INIT,
    payload,
  };
};
