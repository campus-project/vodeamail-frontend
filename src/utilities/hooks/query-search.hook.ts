import * as qs from "query-string";

export const useQuerySearch = () => {
  return qs.parse(window.location.search);
};
