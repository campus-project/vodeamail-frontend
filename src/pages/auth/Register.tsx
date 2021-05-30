import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import { axiosErrorSaveHandler } from "../../utilities/helpers/axios.helper";
import { setStatus } from "../../store/actions/auth.action";
import { useDispatch } from "react-redux";
import { Resource } from "../../interfaces/Resource";
import { useSnackbar } from "notistack";

const Register: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required().label("Name"),
        email: yup.string().email().required().label("Email"),
        organization_name: yup
          .string()
          .required()
          .label("Company or Organization"),
        password: yup.string().min(6).required().label("Password"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password"), null], "${label} does not match")
          .label("Confirmation Password"),
        term_and_condition: yup
          .boolean()
          .required()
          .oneOf([true], "Must be agree with terms and conditions")
          .label("Terms and conditions"),
      })
    ),
  });

  const onSubmit = async (formData: any) => {
    setLoading(true);

    await AuthRepository.register(formData)
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
        axiosErrorSaveHandler(e, setError, enqueueSnackbar);

        if (isMounted.current) {
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
                <Typography variant={"h5"}>Register</Typography>
                <Typography>Vodea Mail is free forever</Typography>
              </div>
              <LogoFull />
            </Box>

            <Box mt={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth margin={"normal"}>
                  <TextField
                    id={"name"}
                    type={"text"}
                    name={"name"}
                    label={"Name"}
                    variant="outlined"
                    inputRef={register()}
                    error={_.has(errors, "name")}
                    helperText={_.get(errors, "name.message")}
                  />
                </FormControl>

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
                    id={"organization_name"}
                    type={"text"}
                    name={"organization_name"}
                    label={"Perusahaan atau organisasi"}
                    variant="outlined"
                    inputRef={register()}
                    error={_.has(errors, "organization_name")}
                    helperText={_.get(errors, "organization_name.message")}
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

                <FormControl
                  required
                  error={_.has(errors, "term_and_condition")}
                  fullWidth
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={"term_and_condition"}
                        inputRef={register()}
                        color="primary"
                      />
                    }
                    label="Agree With Terms and Conditions"
                  />
                  <FormHelperText>
                    {_.get(errors, "term_and_condition.message")}
                  </FormHelperText>
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
                      "Register"
                    )}
                  </Button>
                </FormControl>

                <FormControl fullWidth margin={"normal"}>
                  <Typography>
                    Already have account?
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

export default Register;
