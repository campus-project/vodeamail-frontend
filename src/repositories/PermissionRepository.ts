import {
  api,
  createCancelTokenHandler,
} from "../utilities/services/api.service";

const endPoint = () => process.env.REACT_APP_GATEWAY_ENDPOINT;

export const PermissionRepository = {
  all: function (params: any = null) {
    return api.get(`${endPoint()}/v1/permission`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.all.name].handleRequestCancellation()
          .token,
    });
  },
  show: function (id: number | string, params: any = null) {
    return api.get(`${endPoint()}/v1/permission/${id}`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.show.name].handleRequestCancellation()
          .token,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(PermissionRepository);
