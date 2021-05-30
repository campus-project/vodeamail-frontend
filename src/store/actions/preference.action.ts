import { IPreferenceAction } from "../reducers/preference.reducer";

export const PREFERENCE_INIT = "[PREFERENCE] INIT";

export const initPreference = (payload: string[]): IPreferenceAction => {
  return {
    type: PREFERENCE_INIT,
    payload,
  };
};
