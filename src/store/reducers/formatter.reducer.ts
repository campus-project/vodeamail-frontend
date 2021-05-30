import {
  FORMATTER_CHANGE_DATE,
  FORMATTER_CHANGE_DATE_TIME,
  FORMATTER_CHANGE_NUMBER_LOCALE,
} from "../actions/formatter.action";

export type NumberLocaleType = "en-US" | "id-ID";

export interface IFormatterState {
  date: string;
  datetime: string;
  numberLocale: NumberLocaleType;
}

export interface IFormatterAction {
  type: string;
  payload: any;
}

const initialState: IFormatterState = {
  date: "MMM DD YYYY",
  datetime: "MMM DD YYYY HH:mm",
  numberLocale: "en-US",
};

export const formatter = function (
  state: IFormatterState = initialState,
  action: IFormatterAction
) {
  switch (action.type) {
    case FORMATTER_CHANGE_DATE:
      return {
        ...state,
        date: action.payload,
      };
    case FORMATTER_CHANGE_DATE_TIME:
      return {
        ...state,
        datetime: action.payload,
      };
    case FORMATTER_CHANGE_NUMBER_LOCALE:
      return {
        ...state,
        numberLocale: action.payload,
      };
    default:
      return state;
  }
};
