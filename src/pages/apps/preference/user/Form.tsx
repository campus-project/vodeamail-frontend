import React, { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "../../../../models/User";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserRepository } from "../../../../repositories/UserRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loading from "../../../../components/ui/Loading";
import { Box, Grid, Typography } from "@material-ui/core";
import MuiButtonIconRounded from "../../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import MuiCard from "../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../../components/ui/form/MuiTextField";
import _ from "lodash";
import MuiFormAction from "../../../../components/ui/form/MuiFormAction";
import MuiAutoComplete from "../../../../components/ui/form/MuiAutoComplete";
import { RoleRepository } from "../../../../repositories/RoleRepository";

const defaultValues: User = {
  name: "",
  email: "",
  role_id: null,
};

const UserForm: React.FC<any> = () => {
  const { id } = useParams();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<User>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await UserRepository.show(id)
      .then((resp: AxiosResponse<Resource<User>>) => {
        if (isMounted.current) {
          const { data: user } = resp.data;

          setData(user);
          setOnFetchData(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  const { handleSubmit, errors, setError, control, reset } = useForm<User>({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required(),
      })
    ),
    defaultValues: useMemo(() => {
      (async () => {
        await loadData();
      })();

      return data;
    }, [id, loadData]),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const onSubmit = async (formData: User) => {
    setLoading(true);

    formData.role_id = _.get(formData, "role_id.id");

    await (id
      ? UserRepository.update(id, formData)
      : UserRepository.create(formData)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(`Successfully ${id ? "update" : "create"} user.`, {
            variant: "success",
          });

          navigate("/apps/preference/user");
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
      {onFetchData ? <Loading /> : null}
      <Box
        mb={3}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        style={onFetchData ? { display: "none" } : {}}
      >
        <Box mr={1.5}>
          <MuiButtonIconRounded
            onClick={() => navigate("/apps/preference/user")}
          >
            <NavigateBefore />
          </MuiButtonIconRounded>
        </Box>
        <Typography variant={"h5"}>
          {id ? "Update " : "Create "} Group
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              <MuiCard>
                <MuiCardHead>
                  <Typography variant={"h6"}>Information</Typography>
                </MuiCardHead>

                <MuiCardBody>
                  <Box py={1}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
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

                      <Grid item md={6} xs={12}>
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
                        <Controller
                          control={control}
                          name={"role_id"}
                          render={({ value, onChange }) => {
                            return (
                              <MuiAutoComplete
                                value={value}
                                repository={RoleRepository}
                                onSelected={(value) => onChange(value)}
                                muiTextField={{
                                  label: "Role",
                                }}
                              />
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </MuiCardBody>
              </MuiCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <MuiFormAction
            title={"Save changes?"}
            cancel={"Cancel"}
            save={"Save"}
            onCancel={() => navigate("/apps/preference/user")}
            onSave={handleSubmit(onSubmit)}
            saveDisable={loading}
            saveLoading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default UserForm;
