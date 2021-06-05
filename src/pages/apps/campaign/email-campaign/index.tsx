import React, { useCallback, useMemo, useState } from "react";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useDeleteResource } from "../../../../utilities/hooks/delete-resource.hook";
import { EmailCampaign } from "../../../../models/EmailCampaign";
import MuiDatatable, {
  IMuiDatatableColumn,
} from "../../../../components/datatable/Index";
import _ from "lodash";
import DataDatetime from "../../../../components/data/Datetime";
import ActionCell from "../../../../components/datatable/ActionCell";
import { Box, Button, IconButton, Typography } from "@material-ui/core";
import { Link as LinkDom } from "react-router-dom";
import {
  DeleteOutlined as DeleteOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import MuiCard from "../../../../components/ui/card/MuiCard";
import { EmailCampaignRepository } from "../../../../repositories/EmailCampaignRepository";

const EmailCampaignList: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const { handleDelete } = useDeleteResource(EmailCampaignRepository);

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
                to={`/apps/campaign/email-campaign/${value}/edit`}
              >
                <EditOutlinedIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  handleDelete(value).then(() => loadData(dataQuery));
                }}
              >
                <DeleteOutlinedIcon />
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
        <Typography variant={"h5"}>Email Campaign</Typography>
        <Button
          component={LinkDom}
          to={"/apps/campaign/email-campaign/create"}
          variant={"contained"}
          color={"primary"}
        >
          Create Email Campaign
        </Button>
        {/*todo: kasih notif kalo ga punya email template, dari redux checknya*/}
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

export default EmailCampaignList;
