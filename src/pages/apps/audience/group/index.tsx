import React, { useCallback, useMemo, useState } from "react";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { Group } from "../../../../models/Group";
import { GroupRepository } from "../../../../repositories/GroupRepository";
import { useDeleteResource } from "../../../../utilities/hooks/delete-resource.hook";
import MuiDatatable, {
  IMuiDatatableColumn,
} from "../../../../components/datatable/Index";
import ActionCell from "../../../../components/datatable/ActionCell";
import { IconButton } from "@material-ui/core";
import { Link as LinkDom } from "react-router-dom";
import {
  DeleteOutlined as DeleteOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
} from "@material-ui/icons";
import { Resource } from "../../../../interfaces/Resource";
import { AxiosResponse } from "axios";
import MuiCard from "../../../../components/ui/card/MuiCard";
import DataDatetime from "../../../../components/data/Datetime";
import DataNumber from "../../../../components/data/Number";
import _ from "lodash";

const GroupList: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const { handleDelete } = useDeleteResource(GroupRepository);

  const [data, setData] = useState<Group[]>([]);
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
      columnName: "group.name",
    },
    {
      label: "Total Contact",
      name: "summary",
      columnName: "summary.total_contact",
      options: {
        customBodyRender: (value) => (
          <DataNumber data={_.get(value, "total_contact")} />
        ),
      },
    },
    {
      label: "Updated At",
      name: "updated_at",
      columnName: "group.updated_at",
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

    await GroupRepository.all({
      ...params,
    })
      .then((resp: AxiosResponse<Resource<Group[]>>) => {
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

export default GroupList;
