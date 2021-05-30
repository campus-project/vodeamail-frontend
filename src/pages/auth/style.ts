import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  authWrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("xs")]: {
      backgroundColor: "#fff",
    },
  },
  authContainer: {
    maxWidth: `${theme.breakpoints.values.sm}px`,

    [theme.breakpoints.down("xs")]: {
      paddingLeft: "unset",
      paddingRight: "unset",
    },
  },
  authCard: {
    [theme.breakpoints.up("sm")]: {
      boxShadow: "rgb(78 78 78 / 21%) 0px 9px 20px 0px",
      borderRadius: `${theme.spacing(1.5)}px`,
    },
  },
}));
