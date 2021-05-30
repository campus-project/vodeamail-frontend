import {
  api,
  createCancelTokenHandler,
} from "../utilities/services/api.service";

const endPoint = () => process.env.REACT_APP_GATEWAY_ENDPOINT;

export const AuthRepository = {
  register: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/auth/register`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.register.name].handleRequestCancellation()
          .token,
    });
  },
  forgotPassword: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/auth/forgot-password`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.forgotPassword.name
        ].handleRequestCancellation().token,
    });
  },
  resetPassword: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/auth/reset-password`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.resetPassword.name
        ].handleRequestCancellation().token,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(AuthRepository);
