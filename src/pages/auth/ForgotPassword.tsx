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
import { Link as LinkDom } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import { useStyles } from "./style";
import LogoFull from "../../components/LogoFull";
import { useIsMounted } from "../../utilities/hooks/mounted.hook";
import { AxiosError } from "axios";
import { AuthRepository } from "../../repositories/AuthRepository";
import { Alert } from "@material-ui/lab";

const ForgotPassword: React.FC<any> = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required().label("Email"),
      })
    ),
  });

  const onSubmit = async (formData: any) => {
    setLoading(true);

    await AuthRepository.forgotPassword({
      ...formData,
      url: `${window.location.origin}/auth/reset-password`,
    })
      .then(async (resp: any) => {
        if (isMounted.current) {
          setMessage(resp.data.data);
          setLoading(false);
        }
      })
      .catch((e: AxiosError) => {
        if (isMounted.current) {
          const message = e?.response?.data?.message;
          if (message) {
            setError("email", { message });
          }

          setLoading(false);
          setMessage("");
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
                <Typography variant={"h5"}>Forgot Password</Typography>
                <Typography>Enter mail address registered</Typography>
              </div>
              <LogoFull />
            </Box>

            <Box mt={2}>
              {message && (
                <Box mb={1}>
                  <Alert severity={"success"} variant={"outlined"}>
                    {message}
                  </Alert>
                </Box>
              )}

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
                      "Send Reset Password"
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

export default ForgotPassword;
