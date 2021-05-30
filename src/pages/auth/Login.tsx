import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
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
import { useJwtService } from "../../utilities/hooks/jwt.hook";
import { AxiosError } from "axios";
import { useIsMounted } from "../../utilities/hooks/mounted.hook";
import { useDispatch, useSelector } from "react-redux";
import { clearStatus } from "../../store/actions/auth.action";
import { Alert } from "@material-ui/lab";
import { useQuerySearch } from "../../utilities/hooks/query-search.hook";

const Login: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { email } = useQuerySearch();

  const { login, isOnSignIn, isOnFetchingUser } = useJwtService();

  const { status } = useSelector(({ auth }: any) => ({
    status: auth.status,
  }));

  useEffect(() => {
    return () => {
      dispatch(clearStatus());
    };
  }, []);

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required().label("Email"),
        password: yup.string().min(8).required().label("Password"),
      })
    ),
    defaultValues: { email },
  });

  const onSubmit = (formData: any) => {
    login(formData.email, formData.password).catch((e: AxiosError) => {
      if (isMounted.current) {
        const message = e?.response?.data?.message;
        if (message) {
          setError("email", { message });
        }
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
                <Typography variant={"h5"}>Login</Typography>
                <Typography>Sign in for continue</Typography>
              </div>
              <LogoFull />
            </Box>

            <Box mt={2}>
              {status && (
                <Box mb={1}>
                  <Alert severity={status.severity} variant={"outlined"}>
                    {status.message}
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

                <FormControl fullWidth>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={"remember"}
                          inputRef={register()}
                          defaultChecked
                          color="primary"
                        />
                      }
                      label={"Remember me"}
                    />

                    <Link component={LinkDom} to={"/auth/forgot-password"}>
                      Forgot Password
                    </Link>
                  </Box>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <Button
                    type={"submit"}
                    variant={"contained"}
                    color={"primary"}
                    fullWidth
                    disabled={isOnSignIn || isOnFetchingUser}
                  >
                    {isOnSignIn || isOnFetchingUser ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <Typography>
                    Does not have account?
                    <Link component={LinkDom} to={"/auth/register"}>
                      {" "}
                      Register
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

export default Login;
