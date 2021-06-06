import React, { useCallback, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { AxiosResponse } from "axios";
import { useSnackbar } from "notistack";
import { EmailCampaignRepository } from "../../../repositories/EmailCampaignRepository";
import DataPercentageDifferent from "../../../components/data/PercentageDifferent";
import DataPercentage from "../../../components/data/Percentage";
import DataNumberSI from "../../../components/data/NumberSI";
import MuiCard from "../../../components/ui/card/MuiCard";
import clsx from "clsx";
import useStyles from "./style";
import { axiosErrorHandler } from "../../../utilities/helpers/axios.helper";
import { UsageEmailCampaign } from "../../../models/UsageEmailCampaign";
import { Resource } from "../../../interfaces/Resource";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";

interface ICardEmailCampaignUsage {}

const defaultDashboardUsage: UsageEmailCampaign = {
  total_delivered: 0,
  total_opened: 0,
  total_clicked: 0,
  total_active: 0,
};

const CardEmailCampaignUsage: React.FC<ICardEmailCampaignUsage> = () => {
  const classes = useStyles();
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();

  const [widgetEmailCampaign, setUsageEmailCampaign] =
    React.useState<UsageEmailCampaign>(defaultDashboardUsage);

  const loadDashboardUsage = useCallback(async () => {
    await EmailCampaignRepository.usage()
      .then((resp: AxiosResponse<Resource<UsageEmailCampaign>>) => {
        if (isMounted.current) {
          setUsageEmailCampaign(resp.data.data);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  useMemo(() => {
    loadDashboardUsage().then();
  }, []);

  return (
    <Box className={classes.cardUsageContainer}>
      <CardUsage
        icon={"vicon-email-open"}
        title={"Opened"}
        value={() => (
          <DataPercentageDifferent
            defaultValue={0}
            v1={widgetEmailCampaign?.total_opened || 0}
            v2={widgetEmailCampaign?.total_delivered || 0}
          />
        )}
      />

      <CardUsage
        icon={"vicon-one-finger"}
        title={"Engagement"}
        value={() => (
          <DataPercentageDifferent
            defaultValue={0}
            v1={widgetEmailCampaign?.total_clicked || 0}
            v2={widgetEmailCampaign?.total_delivered || 0}
          />
        )}
      />

      <CardUsage
        icon={"vicon-hourglass"}
        title={"Active"}
        value={widgetEmailCampaign?.total_active || 0}
      />

      <CardUsage
        icon={"vicon-mail"}
        title={"Delivered"}
        value={widgetEmailCampaign?.total_delivered || 0}
      />
    </Box>
  );
};

interface ICardUsage {
  icon: string;
  title: string;
  value: (() => React.ReactNode) | number;
  percentage?: (() => React.ReactNode) | number;
  danger?: boolean;
  style?: React.CSSProperties;
}

const CardUsage: React.FC<ICardUsage> = (props) => {
  const { icon, title, value, percentage, danger = false, style = {} } = props;
  const classes = useStyles();

  return (
    <MuiCard
      className={clsx([classes.cardUsageItem, danger ? "danger" : ""])}
      style={style}
    >
      <Box className={"card-summary-icon-box"}>
        <i className={icon} />
      </Box>
      <Box className={"card-summary-description-box"}>
        <Typography variant={"body2"}>{title}</Typography>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Typography variant={"h6"}>
            {typeof value === "function" ? (
              value()
            ) : (
              <DataNumberSI data={value} />
            )}
          </Typography>
          {percentage === undefined ? null : (
            <Typography variant={"body2"} className={"percentage"}>
              {typeof percentage === "number" ? (
                <DataPercentage data={percentage} />
              ) : (
                percentage()
              )}
            </Typography>
          )}
        </Box>
      </Box>
    </MuiCard>
  );
};

export default CardEmailCampaignUsage;
