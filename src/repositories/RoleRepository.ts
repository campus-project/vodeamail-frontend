import {
  api,
  createCancelTokenHandler,
} from "../utilities/services/api.service";

const endPoint = () => process.env.REACT_APP_GATEWAY_ENDPOINT;

export const RoleRepository = {
  all: function (params: any = null) {
    return api.get(`${endPoint()}/v1/role`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.all.name].handleRequestCancellation()
          .token,
    });
  },
  show: function (id: number | string, params: any = null) {
    return api.get(`${endPoint()}/v1/role/${id}`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.show.name].handleRequestCancellation()
          .token,
    });
  },
  create: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/role`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.create.name].handleRequestCancellation()
          .token,
    });
  },
  update: function (id: number | string, payload: any, params: any = null) {
    return api.put(`${endPoint()}/v1/role/${id}`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.update.name].handleRequestCancellation()
          .token,
    });
  },
  delete: function (id: number | string, params: any = null) {
    return api.delete(`${endPoint()}/v1/role/${id}`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.delete.name].handleRequestCancellation()
          .token,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(RoleRepository);
