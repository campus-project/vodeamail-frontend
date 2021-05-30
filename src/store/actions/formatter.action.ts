import { IMenuAction } from "../reducers/menu.reducer";

export const FORMATTER_CHANGE_DATE = "[FORMATTER] CHANGE DATE";
export const FORMATTER_CHANGE_DATE_TIME = "[FORMATTER] CHANGE DATETIME";
export const FORMATTER_CHANGE_NUMBER_LOCALE = "[FORMATTER] NUMBER LOCALE";

export const changeDateFormat = (payload: string): IMenuAction => {
  return {
    type: FORMATTER_CHANGE_DATE,
    payload,
  };
};

export const changeDateTimeFormat = (payload: string): IMenuAction => {
  return {
    type: FORMATTER_CHANGE_DATE_TIME,
    payload,
  };
};

export const changeNumberLocale = (payload: string): IMenuAction => {
  return {
    type: FORMATTER_CHANGE_NUMBER_LOCALE,
    payload,
  };
};
