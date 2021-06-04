import React, { Fragment } from "react";
import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import MuiCard, { MuiCardProps } from "../../../components/ui/card/MuiCard";
import { BoxProps } from "@material-ui/core/Box/Box";
import { useSelector } from "react-redux";
import { Link as LinkDom } from "react-router-dom";

const PreferenceList: React.FC<any> = () => {
  const { items } = useSelector(({ preference }: any) => ({
    items: preference.items,
  }));

  return (
    <>
      <Box mb={3} display={"flex"} justifyContent={"space-between"}>
        <Typography variant={"h5"}>Preference</Typography>
      </Box>

      <Grid container spacing={3}>
        {items.map((preference: any, index: number) => (
          <Fragment key={index}>
            <Grid item md={4} xs={12}>
              <CardPreference component={LinkDom} to={preference.href}>
                <CardPreferenceIcon>
                  <i className={`${preference.icon} nav-icon`} />
                </CardPreferenceIcon>
                <CardPreferenceDescription>
                  <Typography variant={"h6"}>{preference.title}</Typography>
                  <Typography variant={"body2"}>
                    {preference.description}
                  </Typography>
                </CardPreferenceDescription>
              </CardPreference>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </>
  );
};

const CardPreference = withStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      height: theme.spacing(18),
      padding: theme.spacing(3),
      color: theme.palette.text.primary,
    },
  })
)((props: MuiCardProps & { to?: string }) => <MuiCard {...props} />);

const CardPreferenceIcon = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(3),
      fontSize: 40,
    },
  })
)((props: BoxProps) => <Box {...props} />);

const CardPreferenceDescription = withStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
)((props: BoxProps) => <Box {...props} />);

export default PreferenceList;
