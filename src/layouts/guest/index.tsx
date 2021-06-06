import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { SnackbarProvider } from "notistack";
import { Outlet } from "react-router-dom";
import theme from "../theme";

const LayoutGuest: React.FC<any> = () => {
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

export default LayoutGuest;
