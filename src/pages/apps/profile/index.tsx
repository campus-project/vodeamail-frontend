import React from "react";
import ProfileFormAbout from "./FormAbout";
import ProfileFormPassword from "./FormPassword";
import { Box, Grid, Typography } from "@material-ui/core";
import MuiButtonIconRounded from "../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import _ from "lodash";

const Profile: React.FC<any> = () => {
  const navigate = useNavigate();

  const { user } = useSelector(({ auth }: any) => ({ user: auth.user }));

  return (
    <>
      <Box mb={3} display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Box mr={1.5}>
          <MuiButtonIconRounded onClick={() => navigate("/apps/dashboard")}>
            <NavigateBefore />
          </MuiButtonIconRounded>
        </Box>
        <Typography variant={"h5"}>Profile {_.get(user, "name")}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ProfileFormAbout />
            </Grid>

            <Grid item xs={12}>
              <ProfileFormPassword />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
