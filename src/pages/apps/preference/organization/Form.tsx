import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Organization } from "../../../../models/Organization";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AccountRepository } from "../../../../repositories/AccountRepository";
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

const defaultValues: Organization = {
  name: "",
  telephone: "",
  fax: "",
  address: "",
};

const OrganizationForm: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<Organization>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (isMounted.current) {
      setOnFetchData(true);
    }

    await AccountRepository.getMyOrganization()
      .then((resp: AxiosResponse<Resource<Organization>>) => {
        if (isMounted.current) {
          const { data: organization } = resp.data;

          Object.assign(organization, {
            telephone: organization.telephone || "",
            fax: organization.fax || "",
            address: organization.address || "",
          });

          setData(organization);
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

  const { handleSubmit, errors, setError, control, reset } =
    useForm<Organization>({
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
      }, [loadData]),
    });

  useEffect(() => {
    reset(data);
  }, [data]);

  const onSubmit = async (formData: Organization) => {
    setLoading(true);

    await AccountRepository.updateMyOrganization(formData)
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(`Successfully update organization`, {
            variant: "success",
          });
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
      <Box style={onFetchData ? { display: "none" } : {}}>
        <Box
          mb={3}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <Box mr={1.5}>
            <MuiButtonIconRounded onClick={() => navigate("/apps/preference")}>
              <NavigateBefore />
            </MuiButtonIconRounded>
          </Box>
          <Typography variant={"h5"}>Update Organization</Typography>
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

                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name={"telephone"}
                            render={({ ref, ...others }) => (
                              <MuiTextField
                                {...others}
                                inputRef={ref}
                                label={"Telephone"}
                                error={_.has(errors, "telephone")}
                                helperText={_.get(errors, "telephone.message")}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name={"fax"}
                            render={({ ref, ...others }) => (
                              <MuiTextField
                                {...others}
                                inputRef={ref}
                                label={"Fax"}
                                error={_.has(errors, "fax")}
                                helperText={_.get(errors, "fax.message")}
                              />
                            )}
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
              onCancel={() => navigate("/apps/preference")}
              onSave={handleSubmit(onSubmit)}
              saveDisable={loading}
              saveLoading={loading}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default OrganizationForm;
