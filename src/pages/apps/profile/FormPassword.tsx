import React, { useState } from "react";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AccountRepository } from "../../../repositories/AccountRepository";
import { axiosErrorSaveHandler } from "../../../utilities/helpers/axios.helper";
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
import { Alert } from "@material-ui/lab";
import { AccountPassword } from "../../../models/AccountPassword";

const defaultValues: AccountPassword = {
  old_password: "",
  password: "",
  password_confirmation: "",
};

const ProfileFormPassword: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { handleSubmit, errors, setError, control, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        old_password: yup.string().required().label("old password"),
        password: yup.string().min(8).required().label("Password"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password"), null], "${label} does not match")
          .label("Confirmation Password"),
      })
    ),
    defaultValues,
  });

  const onSubmit = async (formData: any) => {
    setLoading(true);

    await AccountRepository.changePasswordMyAccount(formData)
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(`Successfully update your password.`, {
            variant: "success",
          });

          reset(defaultValues);
          setErrorMessage("");
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          const errorMessage = e?.response?.data?.message;
          setErrorMessage(errorMessage);

          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

  return (
    <MuiCard>
      <MuiCardHead>
        <Typography variant={"h6"}>Change Password</Typography>
      </MuiCardHead>

      <MuiCardBody>
        <Box py={1}>
          <Grid container spacing={3}>
            {errorMessage && (
              <Grid item xs={12}>
                <Alert severity={"error"} variant={"outlined"}>
                  {errorMessage}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                control={control}
                name={"old_password"}
                render={({ ref, ...others }) => (
                  <MuiTextField
                    {...others}
                    inputRef={ref}
                    type={"password"}
                    label={"Old Password"}
                    error={_.has(errors, "old_password")}
                    helperText={_.get(errors, "old_password.message")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name={"password"}
                render={({ ref, ...others }) => (
                  <MuiTextField
                    {...others}
                    inputRef={ref}
                    type={"password"}
                    label={"New Password"}
                    error={_.has(errors, "password")}
                    helperText={_.get(errors, "password.message")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name={"password_confirmation"}
                render={({ ref, ...others }) => (
                  <MuiTextField
                    {...others}
                    inputRef={ref}
                    type={"password"}
                    label={"Confirm Password"}
                    error={_.has(errors, "password_confirmation")}
                    helperText={_.get(errors, "password_confirmation.message")}
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
  );
};

export default ProfileFormPassword;
