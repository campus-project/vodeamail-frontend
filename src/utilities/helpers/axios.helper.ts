import { mapHookFormErrors } from "./common.helper";
import { AxiosError } from "axios";

export const axiosErrorSaveHandler = (
  e: AxiosError,
  setError: any,
  enqueueSnackbar: any
) => {
  if (e?.response?.data?.message) {
    const errors = mapHookFormErrors(e.response.data.message);
    Object.keys(errors).forEach((key: any) => setError(key, errors[key]));
  } else {
    const errorText = e?.response?.statusText;
    enqueueSnackbar(errorText, {
      variant: "error",
    });
  }
};

export const axiosErrorHandler = (e: any, enqueueSnackbar: any) =>
  enqueueSnackbar(
    e?.response?.statusText || "Whoops, looks like something went wrong",
    {
      variant: "error",
    }
  );
