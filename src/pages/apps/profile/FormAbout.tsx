import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";
import { useSnackbar } from "notistack";
import { Organization } from "../../../models/Organization";
import { AccountRepository } from "../../../repositories/AccountRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../interfaces/Resource";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../utilities/helpers/axios.helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loading from "../../../components/ui/Loading";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import MuiCard from "../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../components/ui/form/MuiTextField";
import _ from "lodash";
import { Account } from "../../../models/Account";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../store/actions/auth.action";

const defaultValues: Account = {
  name: "",
  email: "",
};

const ProfileFormAbout: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector(({ auth }: any) => ({ user: auth.user }));

  const [data, setData] = useState<Account>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isReloadData, setIsReloadData] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    if (isMounted.current) {
      setOnFetchData(true);
    }

    await AccountRepository.getMyAccount()
      .then((resp: AxiosResponse<Resource<Account>>) => {
        if (isMounted.current) {
          const { data: account } = resp.data;

          setData(account);
          setOnFetchData(false);
          setIsFirstLoad(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  const { handleSubmit, errors, setError, control, reset } =
    useForm<Organization>({
      mode: "onChange",
      resolver: yupResolver(
        yup.object().shape({
          name: yup.string().required(),
          email: yup.string().email().required(),
        })
      ),
      defaultValues: useMemo(() => {
        (async () => {
          if (isReloadData) {
            await loadData();
            setIsReloadData(false);
          }
        })();

        return data;
      }, [isReloadData, loadData]),
    });

  useEffect(() => {
    reset(data);
  }, [data]);

  const onSubmit = async (formData: Organization) => {
    setLoading(true);

    await AccountRepository.updateMyAccount(formData)
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
          setIsReloadData(true);

          enqueueSnackbar(`Successfully update account.`, {
            variant: "success",
          });

          dispatch(
            setUser({
              ...user,
              ...formData,
            })
          );
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

  return (
    <>
      {onFetchData && isFirstLoad ? <Loading /> : null}
      <MuiCard style={onFetchData && isFirstLoad ? { display: "none" } : {}}>
        <MuiCardHead>
          <Typography variant={"h6"}>Update Information</Typography>
        </MuiCardHead>

        <MuiCardBody>
          <Box py={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name={"name"}
                  render={({ ref, ...others }) => (
                    <MuiTextField
                      {...others}
                      inputRef={ref}
                      label={"Name"}
                      error={_.has(errors, "name")}
                      helperText={_.get(errors, "name.message")}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  control={control}
                  name={"email"}
                  render={({ ref, ...others }) => (
                    <MuiTextField
                      {...others}
                      inputRef={ref}
                      type={"email"}
                      label={"Email"}
                      error={_.has(errors, "email")}
                      helperText={_.get(errors, "email.message")}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Box mr={1}>
                    <Button onClick={() => reset()}>Reset</Button>
                  </Box>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </MuiCardBody>
      </MuiCard>
    </>
  );
};

export default ProfileFormAbout;
