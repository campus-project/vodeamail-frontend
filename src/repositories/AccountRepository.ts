import {
  api,
  createCancelTokenHandler,
} from "../utilities/services/api.service";

const endPoint = () => process.env.REACT_APP_GATEWAY_ENDPOINT;

export const AccountRepository = {
  getMyAccount: function (params: any = null) {
    return api.get(`${endPoint()}/v1/account`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.getMyAccount.name
        ].handleRequestCancellation().token,
    });
  },
  updateMyAccount: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/account`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.updateMyAccount.name
        ].handleRequestCancellation().token,
    });
  },
  changePasswordMyAccount: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/account/change-password`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.changePasswordMyAccount.name
        ].handleRequestCancellation().token,
    });
  },
  getMyOrganization: function (params: any = null) {
    return api.get(`${endPoint()}/v1/account/organization`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.getMyAccount.name
        ].handleRequestCancellation().token,
    });
  },
  updateMyOrganization: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/account/organization`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[
          this.updateMyAccount.name
        ].handleRequestCancellation().token,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(AccountRepository);
