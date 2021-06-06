import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import CardEmailCampaign from "./CardEmailCampaign";
import CardEmailCampaignUsage from "./CardEmailCampaignUsage";

const Dashboard: React.FC<any> = () => {
  return (
    <>
      <Box mb={3} display={"flex"} flexDirection={"row"} alignItems={"center"}>
        <Typography variant={"h5"}>Dashboard</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <CardEmailCampaignUsage />
        </Grid>

        <Grid item xs={12}>
          <CardEmailCampaign />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
