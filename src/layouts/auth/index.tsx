import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { SnackbarProvider } from "notistack";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useJwtService } from "../../utilities/hooks/jwt.hook";
import theme from "../theme";

import Loading from "../../components/ui/Loading";

const LayoutAuth: React.FC<any> = () => {
  const { isOnFetchingUser } = useJwtService();
  const { isLogged } = useSelector(({ auth }: any) => {
    return {
      isLogged: auth.isLogged,
    };
  });

  if (isOnFetchingUser) {
    return <Loading />;
  } else if (isLogged) {
    return <Navigate to={"/apps/dashboard"} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={2500}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Outlet />
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default LayoutAuth;
