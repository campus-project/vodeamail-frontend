import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Paper, Typography } from "@material-ui/core";
import { useParams } from "react-router";
import validator from "validator";
import axios from "axios";

const unsubscribeURL = () =>
  process.env.REACT_APP_UNSUBSCRIBE_URL || "http://localhost:3010/v1/u";

const Unsubscribe: React.FC<any> = () => {
  const { ref } = useParams();
  const classes = useStyles();

  useMemo(() => {
    (async () => {
      if (!validator.isUUID(ref as string)) {
        return false;
      }

      const url = unsubscribeURL();
      if (url !== undefined) {
        await axios.post(`${url}/${ref}`);
      }
    })();
  }, []);

  return (
    <Box className={classes.unsubscribeWrapper}>
      <Container className={classes.unsubscribeContainer}>
        <Paper className={classes.unsubscribeCard}>
          <Box p={4}>
            <Typography
              variant={"h6"}
              style={{ textTransform: "uppercase", marginBottom: 8 }}
            >
              We're sorry to see you go
            </Typography>
            <Typography>
              You are not longer subscribed to our emails,
            </Typography>
            <Typography>
              but there are more ways for you to stay in touch.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export const useStyles = makeStyles((theme) => ({
  unsubscribeWrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("xs")]: {
      backgroundColor: "#fff",
    },
  },
  unsubscribeContainer: {
    maxWidth: `${theme.breakpoints.values.sm}px`,

    [theme.breakpoints.down("xs")]: {
      paddingLeft: "unset",
      paddingRight: "unset",
    },
  },
  unsubscribeCard: {
    boxShadow: "unset",
  },
}));

export default Unsubscribe;
