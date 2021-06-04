import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import MuiTextField, { MuiTextFieldProps } from "./MuiTextField";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import _ from "lodash";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";
import { axiosErrorHandler } from "../../../utilities/helpers/axios.helper";
import { Resource } from "../../../interfaces/Resource";

export interface IParams {
  [key: string]: string | number | Array<string | number>;
}

export type TypeFunctionOptionLabel = (option: any) => string;
export type TypeFunctionOptionSelected = (option: any, value: any) => boolean;

export interface MuiAutoCompleteProps
  extends Omit<
    AutocompleteProps<any, any, any, any>,
    "renderInput" | "options"
  > {
  repository: any;
  onSelected: (option: any) => void;
  methodName?: string;
  isKeepClear?: boolean;
  optionLabel?: string | TypeFunctionOptionLabel;
  optionSelected?: string | TypeFunctionOptionSelected;
  params?: IParams;
  muiTextField?: MuiTextFieldProps;
}

const MuiAutoComplete = withStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
)((props: MuiAutoCompleteProps) => {
  const {
    repository,
    onSelected,
    methodName = "all",
    isKeepClear = false,
    optionLabel = "name",
    optionSelected = "id",
    params = {},
    muiTextField = {},
    ...others
  } = props;
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (isKeepClear && value) {
      setValue(null);
    }
  }, [isKeepClear, value]);

  const onOpen = async () => {
    if (typeof repository.all !== "function") {
      throw new Error("The repository is invalid.");
    }

    setLoading(true);
    setOptions([]);

    await repository[methodName](params)
      .then((resp: AxiosResponse<Resource<any[]>>) => {
        setOptions(resp.data.data);

        if (isMounted.current) {
          setLoading(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  };

  const onChange = (event: any, newValue: any) => {
    if (isKeepClear) {
      setValue(newValue);
    }

    onSelected(newValue);
  };

  const label = (option: any) =>
    typeof optionLabel == "function"
      ? optionLabel(option)
      : _.get(option, optionLabel);

  const selected = (option: any, value: any) =>
    typeof optionSelected == "function"
      ? optionSelected(option, value)
      : _.get(option, optionSelected) === _.get(value, optionSelected);

  return (
    <Autocomplete
      {...others}
      {...(isKeepClear ? { value } : {})}
      loading={loading}
      options={options}
      onOpen={onOpen}
      onChange={onChange}
      getOptionLabel={(option) => label(option)}
      getOptionSelected={(option, value) => selected(option, value)}
      renderInput={(params) => <MuiTextField {...params} {...muiTextField} />}
    />
  );
});

export default MuiAutoComplete;
