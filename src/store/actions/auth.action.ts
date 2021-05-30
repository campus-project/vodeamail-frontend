import { IAuthAction, IAuthStatus } from "../reducers/auth.reducer";

export const AUTH_SET_USER = "[AUTH] SET USER";
export const AUTH_SET_STATUS = "[AUTH] SET STATUS";

export const setUser = (payload: any): IAuthAction => {
  return {
    type: AUTH_SET_USER,
    payload,
  };
};

export const setStatus = (payload: IAuthStatus): IAuthAction => {
  return {
    type: AUTH_SET_STATUS,
    payload,
  };
};

export const clearStatus = (): IAuthAction => {
  return {
    type: AUTH_SET_STATUS,
    payload: null,
  };
};
