import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link as LinkDom, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import { useStyles } from "./style";
import LogoFull from "../../components/LogoFull";
import { useIsMounted } from "../../utilities/hooks/mounted.hook";
import { AxiosError, AxiosResponse } from "axios";
import { AuthRepository } from "../../repositories/AuthRepository";
import { useDispatch } from "react-redux";
import { setStatus } from "../../store/actions/auth.action";
import { Resource } from "../../interfaces/Resource";
import { useQuerySearch } from "../../utilities/hooks/query-search.hook";

const ResetPassword: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { token, email } = useQuerySearch();

  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required().label("Email"),
        password: yup.string().min(8).required().label("Password"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password"), null], "${label} does not match")
          .label("Confirmation Password"),
      })
    ),
    defaultValues: {
      email,
    },
  });

  const onSubmit = async (formData: any) => {
    setLoading(true);

    await AuthRepository.resetPassword({
      ...formData,
      token,
    })
      .then(async (resp: AxiosResponse<Resource<string>>) => {
        if (isMounted.current) {
          setLoading(false);

          dispatch(
            setStatus({
              severity: "success",
              message: resp.data.data,
            })
          );

          navigate(`/auth/login?email=${formData.email}`);
        }
      })
      .catch((e: AxiosError) => {
        if (isMounted.current) {
          const message = e?.response?.data?.message;
          if (message) {
            setError("email", { message });
          }

          setLoading(false);
        }
      });
  };

  return (
    <Box className={classes.authWrapper}>
      <Container className={classes.authContainer}>
        <Paper className={classes.authCard}>
          <Box p={4}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <div>
                <Typography variant={"h5"}>Reset Password</Typography>
                <Typography>Reset password for continue login</Typography>
              </div>
              <LogoFull />
            </Box>

            <Box mt={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth margin={"normal"}>
                  <TextField
                    id={"email"}
                    type={"text"}
                    name={"email"}
                    label={"Email"}
                    variant="outlined"
                    inputRef={register()}
                    error={_.has(errors, "email")}
                    helperText={_.get(errors, "email.message")}
                  />
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <TextField
                    id={"password"}
                    type={"password"}
                    name={"password"}
                    label={"Password"}
                    variant="outlined"
                    inputRef={register()}
                    error={_.has(errors, "password")}
                    helperText={_.get(errors, "password.message")}
                  />
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <TextField
                    id={"password_confirmation"}
                    type={"password"}
                    name={"password_confirmation"}
                    label={"Confirm Password"}
                    variant="outlined"
                    inputRef={register()}
                    error={_.has(errors, "password_confirmation")}
                    helperText={_.get(errors, "password_confirmation.message")}
                  />
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <Button
                    type={"submit"}
                    variant={"contained"}
                    color={"primary"}
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <Typography>
                    Remember Password?
                    <Link component={LinkDom} to={"/auth/login"}>
                      {" "}
                      Login
                    </Link>
                  </Typography>
                </FormControl>
              </form>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
