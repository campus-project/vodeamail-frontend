import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { SummaryEmailCampaignAnalytic } from "../../../../models/SummaryEmailCampaignAnalytic";
import { Group } from "../../../../models/Group";
import { EmailCampaign } from "../../../../models/EmailCampaign";
import { EmailCampaignRepository } from "../../../../repositories/EmailCampaignRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import { axiosErrorHandler } from "../../../../utilities/helpers/axios.helper";
import moment from "moment";
import MuiCard from "../../../../components/ui/card/MuiCard";
import MuiDatatable, {
  IMuiDatatableColumn,
} from "../../../../components/datatable/Index";
import MuiCardHead from "../../../../components/ui/card/MuiCardHead";
import DataDatetime from "../../../../components/data/Datetime";
import DataNumber from "../../../../components/data/Number";
import DataPercentage from "../../../../components/data/Percentage";
import DataPercentageDifferent from "../../../../components/data/PercentageDifferent";
import DataNumberSI from "../../../../components/data/NumberSI";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import useStyles from "./style";
import clsx from "clsx";
import MuiButtonIconRounded from "../../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import Loading from "../../../../components/ui/Loading";
import _ from "lodash";

interface EmailCampaignAnalytic extends Partial<EmailCampaign> {}

const defaultValues: EmailCampaignAnalytic = {
  name: "",
};

const AnalyticEmailDetail: React.FC<any> = () => {
  const { id } = useParams();
  const classes = useStyles();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<EmailCampaignAnalytic>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));

  const [summaryEmailCampaignAnalytics, setSummaryEmailCampaignAnalytics] =
    useState<SummaryEmailCampaignAnalytic[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await EmailCampaignRepository.show(id, {
      relations: ["groups", "summary_email_campaign_analytics"],
    })
      .then((resp: AxiosResponse<Resource<EmailCampaign>>) => {
        if (isMounted.current) {
          const { data: emailCampaign } = resp.data;

          setSummaryEmailCampaignAnalytics(
            emailCampaign.summary_email_campaign_analytics || []
          );
          setGroups(emailCampaign.groups || []);
          setData(emailCampaign);
          setOnFetchData(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);

          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  useMemo(() => {
    (async () => {
      loadData().then();
    })();
  }, []);

  return (
    <>
      {onFetchData ? <Loading /> : null}
      <Box
        mb={3}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        style={onFetchData ? { display: "none" } : {}}
      >
        <Box mr={1.5}>
          <MuiButtonIconRounded
            onClick={() => navigate("/apps/analytic/email")}
          >
            <NavigateBefore />
          </MuiButtonIconRounded>
        </Box>
        <Typography variant={"h5"}>{data.name || "Email Analytic"}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className={classes.cardSummaryContainer}>
                <CardSummary
                  icon={"vicon-people"}
                  title={"Delivered"}
                  value={data?.summary?.total_delivered || 0}
                  percentage={() => (
                    <DataPercentageDifferent
                      v1={data?.summary?.total_delivered || 0}
                      v2={data?.summary?.total_audience || 0}
                    />
                  )}
                />

                <CardSummary
                  icon={"vicon-people"}
                  title={"Opened"}
                  value={data?.summary?.total_opened || 0}
                  percentage={() => (
                    <DataPercentageDifferent
                      v1={data?.summary?.total_opened || 0}
                      v2={data?.summary?.total_audience || 0}
                    />
                  )}
                />

                <CardSummary
                  icon={"vicon-people"}
                  title={"Engagement"}
                  value={data?.summary?.total_clicked || 0}
                  percentage={() => (
                    <DataPercentageDifferent
                      v1={data?.summary?.total_clicked || 0}
                      v2={data?.summary?.total_audience || 0}
                    />
                  )}
                />

                <CardSummary
                  icon={"vicon-people"}
                  title={"Unsubscribe"}
                  danger={true}
                  value={data?.summary?.total_unsubscribe || 0}
                  percentage={() => (
                    <DataPercentageDifferent
                      v1={data?.summary?.total_unsubscribe || 0}
                      v2={data?.summary?.total_audience || 0}
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <EmailCampaignAudience
                totalAudience={data?.summary?.total_audience}
                groups={groups}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <EmailCampaignSummary
                subject={data.subject}
                sendAt={data.send_at}
                lastOpened={data?.summary?.last_opened}
                lastClicked={data?.summary?.last_clicked}
                avgOpenDuration={data?.summary?.avg_open_duration}
              />
            </Grid>

            <Grid item xs={12}>
              <EmailCampaignPerformance
                summaryEmailCampaignAnalytics={summaryEmailCampaignAnalytics}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

interface ICardSummary {
  icon: string;
  title: string;
  value: number;
  percentage?: (() => React.ReactNode) | number;
  danger?: boolean;
  style?: React.CSSProperties;
}

const CardSummary: React.FC<ICardSummary> = (props) => {
  const { icon, title, value, percentage, danger = false, style = {} } = props;
  const classes = useStyles();

  return (
    <MuiCard
      className={clsx([classes.cardSummaryItem, danger ? "danger" : ""])}
      style={style}
      p={1.5}
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
            <DataNumberSI data={value} />
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

interface IEmailCampaignSummary {
  subject?: string;
  sendAt?: string;
  lastOpened?: string;
  lastClicked?: string;
  avgOpenDuration?: number | null;
}

const EmailCampaignSummary: React.FC<IEmailCampaignSummary> = (props) => {
  const { subject, sendAt, lastOpened, lastClicked, avgOpenDuration } = props;
  const classes = useStyles();

  return (
    <MuiCard>
      <MuiCardHead borderless={1}>
        <Typography variant={"h6"}>Summary</Typography>
      </MuiCardHead>

      <Table aria-label="summary table" className={classes.summaryTable}>
        <TableBody>
          <TableRow>
            <TableCell align={"left"}>
              <Typography variant={"body2"}>Subject</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant={"subtitle2"}>{subject || ""}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={"left"}>
              <Typography variant={"body2"}>Send At</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant={"subtitle2"}>
                {sendAt === undefined ? null : <DataDatetime data={sendAt} />}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={"left"}>
              <Typography variant={"body2"}>Last Opened</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant={"subtitle2"}>
                {lastOpened === undefined ? (
                  "-"
                ) : (
                  <DataDatetime data={lastOpened} />
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={"left"}>
              <Typography variant={"body2"}>Last Clicked</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant={"subtitle2"}>
                {lastClicked === undefined ? (
                  "-"
                ) : (
                  <DataDatetime data={lastClicked} />
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align={"left"}>
              <Typography variant={"body2"}>Avg Open Duration</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant={"subtitle2"}>
                {avgOpenDuration === undefined || avgOpenDuration === null ? (
                  "-"
                ) : (
                  <DataNumber data={avgOpenDuration} suffix={" minute(s)"} />
                )}
                {/*todo: convert minute to duration like 1 day 30minutes with translation*/}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </MuiCard>
  );
};

interface IEmailCampaignPerformance {
  summaryEmailCampaignAnalytics: SummaryEmailCampaignAnalytic[];
}

const EmailCampaignPerformance: React.FC<IEmailCampaignPerformance> = (
  props
) => {
  const { summaryEmailCampaignAnalytics } = props;

  const options = {
    responsive: true,
    hoverMode: "index",
    stacked: false,
    scales: {
      yAxes: [],
    },
  };

  const [dataSets, setDataSets] = React.useState<{
    labels: string[];
    datasets: any[];
  }>({
    labels: [],
    datasets: [],
  });

  const { date } = useSelector(({ formatter }: any) => ({
    date: formatter.date,
  }));

  useMemo(() => {
    const valueLabels = summaryEmailCampaignAnalytics.length
      ? []
      : [moment().format(date)];

    const valueDataSets: any[] = [
      {
        label: "Open",
        data: [],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgb(75, 192, 192)",
      },
      {
        label: "Engagement",
        data: [],
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgb(54, 162, 235)",
      },
    ];

    summaryEmailCampaignAnalytics.forEach(
      (summaryEmailCampaignAnalytic, index) => {
        if (index === 0 && summaryEmailCampaignAnalytics.length === 1) {
          valueLabels.push(
            moment(summaryEmailCampaignAnalytic.date)
              .startOf("day")
              .subtract(1, "day")
              .format(date)
          );

          valueDataSets[0].data.push(0);
          valueDataSets[1].data.push(0);
        }

        valueLabels.push(
          moment(summaryEmailCampaignAnalytic.date).format(date)
        );

        valueDataSets[0].data.push(summaryEmailCampaignAnalytic.total_opened);
        valueDataSets[1].data.push(summaryEmailCampaignAnalytic.total_clicked);
      }
    );

    setDataSets({
      labels: valueLabels,
      datasets: valueDataSets,
    });
  }, [summaryEmailCampaignAnalytics]);

  return (
    <MuiCard>
      <MuiCardHead borderless={1}>
        <Typography variant={"h6"}>Performance</Typography>
      </MuiCardHead>

      <Box px={4} py={1}>
        <Line data={dataSets} options={options} />
      </Box>
    </MuiCard>
  );
};

interface IEmailCampaignAudience {
  totalAudience?: number;
  groups: Group[];
}

const EmailCampaignAudience: React.FC<IEmailCampaignAudience> = (props) => {
  const { totalAudience, groups } = props;

  const dataTableGroupColumns: IMuiDatatableColumn[] = [
    {
      label: "Name",
      name: "name",
    },
    {
      label: "Current Contact",
      name: "summary",
      columnName: "summary.total_contact",
      options: {
        customBodyRender: (value) => (
          <DataNumber data={_.get(value, "total_contact")} />
        ),
      },
    },
  ];

  return (
    <MuiCard>
      <CardSummary
        icon={"vicon-people"}
        title={"Audience"}
        value={totalAudience || 0}
        style={{ boxShadow: "unset", padding: "0px 12px" }}
      />

      <MuiDatatable
        data={groups}
        columns={dataTableGroupColumns}
        disableServerSide={true}
        options={{ rowsPerPage: 5 }}
      />
    </MuiCard>
  );
};

export default AnalyticEmailDetail;
