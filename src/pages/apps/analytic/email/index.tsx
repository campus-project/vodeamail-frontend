import React, { useCallback, useMemo, useState } from "react";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { EmailCampaign } from "../../../../models/EmailCampaign";
import MuiDatatable, {
  IMuiDatatableColumn,
} from "../../../../components/datatable/Index";
import _ from "lodash";
import DataDatetime from "../../../../components/data/Datetime";
import DataNumberSI from "../../../../components/data/NumberSI";
import ActionCell from "../../../../components/datatable/ActionCell";
import { Box, IconButton, Typography } from "@material-ui/core";
import { Link as LinkDom } from "react-router-dom";
import { AssessmentOutlined as AssessmentOutlinedIcon } from "@material-ui/icons";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import MuiCard from "../../../../components/ui/card/MuiCard";
import { EmailCampaignRepository } from "../../../../repositories/EmailCampaignRepository";

const EmailAnalyticList: React.FC<any> = () => {
  const isMounted = useIsMounted();

  const [data, setData] = useState<EmailCampaign[]>([]);
  const [totalData, setTotalData] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataQuery, setDataQuery] = useState<any>({
    page: 1,
    per_page: 5,
  });

  const columns: IMuiDatatableColumn[] = [
    {
      label: "Name",
      name: "name",
      columnName: "email_campaign.name",
    },
    {
      label: "Subject",
      name: "subject",
      columnName: "email_campaign.subject",
    },
    {
      label: "From Name",
      name: "from_name",
      columnName: "email_campaign.from_name",
    },
    {
      label: "Email From",
      name: "summary",
      columnName: "summary.from_email",
      options: {
        customBodyRender: (value) => _.get(value, "from_email"),
      },
    },
    {
      label: "Total Group",
      name: "summary",
      columnName: "summary.total_group",
      options: {
        customBodyRender: (value) => (
          <DataNumberSI data={_.get(value, "total_group", 0)} />
        ),
      },
    },
    {
      label: "Total Audience",
      name: "summary",
      columnName: "summary.total_audience",
      options: {
        customBodyRender: (value) => (
          <DataNumberSI data={_.get(value, "total_audience", 0)} />
        ),
      },
    },
    {
      label: "Send At",
      name: "send_at",
      columnName: "email_campaign.send_at",
      options: {
        customBodyRender: (value) => <DataDatetime data={value} />,
      },
    },
    {
      label: "Updated At",
      name: "updated_at",
      columnName: "email_campaign.updated_at",
      options: {
        customBodyRender: (value) => <DataDatetime data={value} />,
      },
    },
    {
      label: " ",
      name: "id",
      options: {
        customBodyRender: (value) => {
          return (
            <ActionCell>
              <IconButton
                component={LinkDom}
                to={`/apps/analytic/email/${value}`}
              >
                <AssessmentOutlinedIcon />
              </IconButton>
            </ActionCell>
          );
        },
      },
    },
  ];

  const loadData = useCallback(async (params = dataQuery) => {
    if (isMounted.current) {
      setLoading(true);
    }

    await EmailCampaignRepository.all({
      ...params,
    })
      .then((resp: AxiosResponse<Resource<EmailCampaign[]>>) => {
        if (isMounted.current) {
          setLoading(false);
          setData(resp.data.data);
          setTotalData(resp.data.meta.total);
        }
      })
      .catch(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, []);

  useMemo(() => {
    (async () => {
      await loadData(dataQuery);
    })();
  }, [loadData, dataQuery]);

  const onTableChange = (action: string, tableState: any) => {
    if (action === "propsUpdate") {
      return;
    }

    const { page, rowsPerPage: per_page, sortOrder } = tableState;
    const { name, columnName, direction: sorted_by } = sortOrder;
    setDataQuery({
      ...dataQuery,
      page: page + 1,
      per_page,
      ...(sortOrder ? { order_by: columnName || name, sorted_by } : {}),
    });
  };

  const onSearchChange = _.debounce(
    (event: any) =>
      setDataQuery({
        ...dataQuery,
        page: 1,
        search: event.target.value || undefined,
      }),
    200
  );

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant={"h5"}>Email Analytic</Typography>
      </Box>

      <Box mt={3}>
        <MuiCard>
          <MuiDatatable
            data={data}
            columns={columns}
            loading={loading}
            onTableChange={onTableChange}
            options={{
              count: totalData,
              page: dataQuery.page - 1,
              rowsPerPage: dataQuery.per_page,
            }}
            inputSearch={{ onChange: onSearchChange }}
          />
        </MuiCard>
      </Box>
    </>
  );
};

export default EmailAnalyticList;
