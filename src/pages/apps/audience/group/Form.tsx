import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Group } from "../../../../models/Group";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { GroupRepository } from "../../../../repositories/GroupRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import { Contact } from "../../../../models/Contact";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Loading from "../../../../components/ui/Loading";
import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import MuiButtonIconRounded from "../../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import MuiCard from "../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../../components/ui/form/MuiTextField";
import _ from "lodash";
import MuiFormAction from "../../../../components/ui/form/MuiFormAction";
import { createStyles } from "@material-ui/core/styles";
import { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import { Alert } from "@material-ui/lab";
import useStyles from "../style";
import MuiDatatable from "../../../../components/datatable/Index";
import MuiAutoComplete from "../../../../components/ui/form/MuiAutoComplete";
import { ContactRepository } from "../../../../repositories/ContactRepository";

const defaultValues: Group = {
  name: "",
  description: "",
  contact_ids: [],
};

const GroupForm: React.FC<any> = () => {
  const { id } = useParams();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<Group>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await GroupRepository.show(id, {
      relations: ["contacts"],
    })
      .then((resp: AxiosResponse<Resource<Group>>) => {
        if (isMounted.current) {
          const { data: group } = resp.data;

          Object.assign(group, {
            description: group.description || "",
          });

          setContacts(group.contacts || []);
          setData(group);
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

  const { handleSubmit, errors, setError, control, reset } = useForm<Group>({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required(),
        description: yup.string().nullable(true),
        is_visible: yup.boolean().nullable(true),
      })
    ),
    defaultValues: useMemo(() => {
      (async () => {
        await loadData();
      })();

      return data;
    }, [id, loadData]),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const onDeleteContact = (indexDeleted: number[]) =>
    setContacts((nodes) =>
      nodes.filter((contact, index) => !indexDeleted.includes(index))
    );

  const onSelectedContact = (contact: Contact | null) => {
    if (contact === null) {
      return false;
    }

    setContacts((nodes) => [contact, ...nodes]);
  };

  const onSubmit = async (formData: Group) => {
    setLoading(true);

    Object.assign(formData, {
      contact_ids: contacts.map((contact) => contact.id),
    });

    await (id
      ? GroupRepository.update(id, formData)
      : GroupRepository.create(formData)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(`Successfully ${id ? "update" : "create"} group.`, {
            variant: "success",
          });

          navigate("/apps/audience?tab=1");
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

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
            onClick={() => navigate("/apps/audience?tab=1")}
          >
            <NavigateBefore />
          </MuiButtonIconRounded>
        </Box>
        <Typography variant={"h5"}>
          {id ? "Update " : "Create "} Group
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              <MuiCard>
                <MuiCardHead>
                  <Typography variant={"h6"}>Information</Typography>
                </MuiCardHead>

                <MuiCardBody>
                  <Box py={1}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Controller
                          control={control}
                          name={"name"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Name"}
                              error={_.has(errors, "name")}
                              helperText={_.get(errors, "name.message")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          control={control}
                          name={"description"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Description"}
                              error={_.has(errors, "description")}
                              helperText={_.get(errors, "description.message")}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </MuiCardBody>
              </MuiCard>
            </Grid>

            <Grid item md={8} xs={12}>
              <MuiCard>
                <MuiCardHead>
                  <Typography variant={"h6"}>Contact</Typography>
                </MuiCardHead>

                <MuiCardBody>
                  <SearchContact
                    selectedIds={
                      contacts
                        .map((node) => node.id)
                        .filter((node) => node !== undefined) as string[]
                    }
                    onSelected={onSelectedContact}
                  />

                  <Box mt={2}>
                    <TableContact
                      contacts={contacts}
                      onDelete={onDeleteContact}
                    />
                  </Box>
                </MuiCardBody>
              </MuiCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <MuiFormAction
            title={"Save changes?"}
            cancel={"Cancel"}
            save={"Save"}
            onCancel={() => navigate("/apps/audience?tab=1")}
            onSave={handleSubmit(onSubmit)}
            saveDisable={loading}
            saveLoading={loading}
          />
        </Grid>
      </Grid>
    </>
  );
};

interface TableContactProps {
  contacts: any[];
  onDelete: (indexDeleted: number[]) => void;
}

const TableContact = withStyles(() =>
  createStyles({
    overrides: {
      MuiTableCell: {
        body: {
          borderBottom: "unset !important",
        },
      },
    },
  })
)(({ contacts, onDelete }: TableContactProps) => {
  const classes = useStyles();

  const columns: MUIDataTableColumn[] = [
    {
      label: "Email",
      name: "email",
    },
    {
      label: "Status",
      name: "is_subscribed",
      options: {
        customBodyRender: (value) => {
          return (
            <Alert
              className={classes.status}
              icon={false}
              severity={value ? "success" : "error"}
            >
              <Typography variant={"caption"}>
                {value ? "Subscribed" : "Not Subscribed"}
              </Typography>
            </Alert>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    page: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20, 50],
    print: false,
    viewColumns: false,
    elevation: 0,
    responsive: "simple",
    onRowsDelete: (rowsDeleted) => {
      onDelete(rowsDeleted.data.map((rowDeleted) => rowDeleted.dataIndex));
    },
  };

  return (
    <MuiDatatable
      data={contacts}
      columns={columns}
      options={options}
      selectableRows={"multiple"}
    />
  );
});

interface ISearchContact {
  selectedIds: string[];
  onSelected: (contact: Contact) => void;
}

const SearchContact: React.FC<ISearchContact> = ({
  selectedIds,
  onSelected,
}) => {
  const filterOptions = (options: any, state: any) =>
    options.filter(
      (option: any) =>
        !selectedIds.includes(option.id) &&
        (state.inputValue ? option.email.search(state.inputValue) : 1) !== -1
    );

  return (
    <MuiAutoComplete
      repository={ContactRepository}
      onSelected={onSelected}
      filterOptions={filterOptions}
      disableCloseOnSelect={true}
      optionLabel={"email"}
      isKeepClear={true}
      muiTextField={{
        label: "Email",
      }}
    />
  );
};

export default GroupForm;
