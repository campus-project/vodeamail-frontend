import React, { useCallback, useMemo, useState } from "react";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useDeleteResource } from "../../../../utilities/hooks/delete-resource.hook";
import { User } from "../../../../models/User";
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
import { UserRepository } from "../../../../repositories/UserRepository";
import { useSelector } from "react-redux";

const UserList: React.FC<any> = () => {
  const isMounted = useIsMounted();
  const { handleDelete } = useDeleteResource(UserRepository);

  const { user } = useSelector(({ auth }: any) => ({
    user: auth.user,
  }));

  const [data, setData] = useState<User[]>([]);
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
      columnName: "user.name",
    },
    {
      label: "Email",
      name: "email",
      columnName: "user.email",
    },
    {
      label: "Updated At",
      name: "updated_at",
      columnName: "user.updated_at",
      options: {
        customBodyRender: (value) => <DataDatetime data={value} />,
      },
    },
    {
      label: " ",
      name: "id",
      options: {
        customBodyRender: (value) => {
          const canDelete = value !== user.id;

          return (
            <ActionCell>
              <IconButton
                component={LinkDom}
                to={`/apps/preference/user/${value}/edit`}
              >
                <EditOutlinedIcon />
              </IconButton>

              {canDelete && (
                <IconButton
                  onClick={() => {
                    handleDelete(value).then(() => loadData(dataQuery));
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              )}
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

    await UserRepository.all({
      ...params,
    })
      .then((resp: AxiosResponse<Resource<User[]>>) => {
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
        <Typography variant={"h5"}>User</Typography>

        <Button
          component={LinkDom}
          to={"/apps/preference/user/create"}
          variant={"contained"}
          color={"primary"}
        >
          Create User
        </Button>
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

export default UserList;
