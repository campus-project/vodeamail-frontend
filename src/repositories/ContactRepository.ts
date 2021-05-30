import {
  api,
  createCancelTokenHandler,
} from "../utilities/services/api.service";

const endPoint = () => process.env.REACT_APP_GATEWAY_ENDPOINT;

export const ContactRepository = {
  all: function (params: any = null) {
    return api.get(`${endPoint()}/v1/contact`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.all.name].handleRequestCancellation()
          .token,
    });
  },
  show: function (id: number | string, params: any = null) {
    return api.get(`${endPoint()}/v1/contact/${id}`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.show.name].handleRequestCancellation()
          .token,
    });
  },
  create: function (payload: any, params: any = null) {
    return api.post(`${endPoint()}/v1/contact`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.create.name].handleRequestCancellation()
          .token,
    });
  },
  update: function (id: number | string, payload: any, params: any = null) {
    return api.put(`${endPoint()}/v1/contact/${id}`, payload, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.update.name].handleRequestCancellation()
          .token,
    });
  },
  delete: function (id: number | string, params: any = null) {
    return api.delete(`${endPoint()}/v1/contact/${id}`, {
      params,
      cancelToken:
        cancelTokenHandlerObject[this.delete.name].handleRequestCancellation()
          .token,
    });
  },
};

const cancelTokenHandlerObject = createCancelTokenHandler(ContactRepository);
