import React, { useEffect } from "react";
import { CssBaseline, ThemeProvider, Toolbar } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { SnackbarProvider } from "notistack";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useJwtService } from "../../utilities/hooks/jwt.hook";
import theme from "../theme";
import useStyles from "./style";
import Loading from "../../components/ui/Loading";
import { ConfirmProvider } from "material-ui-confirm";
import { initMenu } from "../../store/actions/menu.action";
import clsx from "clsx";
import HeaderComponent from "./parts/Header";
import SidebarComponent from "./parts/Sidebar";

const LayoutApps: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isOnFetchingUser } = useJwtService();

  const { isLogged, isOpen } = useSelector(({ auth, sidebar }: any) => ({
    isLogged: auth.isLogged,
    isOpen: sidebar.isOpen,
  }));

  useEffect(() => {
    dispatch(initMenu([]));
  }, []);

  if (isOnFetchingUser) {
    return <Loading />;
  } else if (!isLogged) {
    return <Navigate to={"/auth"} />;
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
          <ConfirmProvider>
            <HeaderComponent />
            <SidebarComponent />
            <main
              className={clsx(classes.content, {
                [classes.contentShift]: !isOpen,
              })}
            >
              <Toolbar />
              <div className={classes.contentInside}>
                <Outlet />
              </div>
            </main>
          </ConfirmProvider>
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default LayoutApps;
