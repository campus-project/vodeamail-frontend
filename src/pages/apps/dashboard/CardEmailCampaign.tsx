import React, { useCallback, useMemo, useState } from "react";
import { IconButton, Typography } from "@material-ui/core";
import { Link as LinkDom } from "react-router-dom";
import { EditOutlined as EditOutlinedIcon } from "@material-ui/icons";
import { AxiosResponse } from "axios";
import MuiCard from "../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../components/ui/card/MuiCardHead";
import { EmailCampaign } from "../../../models/EmailCampaign";
import MuiDatatable, {
  IMuiDatatableColumn,
} from "../../../components/datatable/Index";
import { EmailCampaignRepository } from "../../../repositories/EmailCampaignRepository";
import { Resource } from "../../../interfaces/Resource";
import _ from "lodash";
import DataNumber from "../../../components/data/Number";
import DataDatetime from "../../../components/data/Datetime";
import { useIsMounted } from "../../../utilities/hooks/mounted.hook";
import ActionCell from "../../../components/datatable/ActionCell";

const CardEmailCampaign: React.FC<any> = () => {
  const isMounted = useIsMounted();

  const [data, setData] = useState<EmailCampaign[]>([]);
  const [totalData, setTotalData] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataQuery, setDataQuery] = useState<any>({
    page: 1,
    per_page: 5,
    order_by: "email_campaign.updated_at",
    sorted_by: "DESC",
  });

  const columns: IMuiDatatableColumn[] = [
    {
      label: "Name",
      name: "name",
      columnName: "group.name",
    },
    {
      label: "Total Audience",
      name: "summary",
      columnName: "summary.total_audience",
      options: {
        customBodyRender: (value) => (
          <DataNumber data={_.get(value, "total_audience")} />
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
                to={`/apps/audience/group/${value}/edit`}
              >
                <EditOutlinedIcon />
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
    <MuiCard>
      <MuiCardHead borderless={1}>
        <Typography variant={"h6"}>Newest Campaign</Typography>
      </MuiCardHead>

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
  );
};

export default CardEmailCampaign;
