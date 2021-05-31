import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Contact } from "../../../../models/Contact";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Group } from "../../../../models/Group";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import { ContactRepository } from "../../../../repositories/ContactRepository";
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
import _ from "lodash";
import MuiTextField from "../../../../components/ui/form/MuiTextField";
import MuiFormAction from "../../../../components/ui/form/MuiFormAction";
import { createStyles } from "@material-ui/core/styles";
import { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import MuiAutoComplete from "../../../../components/ui/form/MuiAutoComplete";
import { GroupRepository } from "../../../../repositories/GroupRepository";
import MuiDatatable from "../../../../components/datatable/Index";

const defaultValues: Contact = {
  email: "",
  name: "",
  mobile_phone: "",
  address_line_1: "",
  address_line_2: "",
  country: "",
  province: "",
  city: "",
  postal_code: "",
  group_ids: [],
};

const ContactForm: React.FC<any> = () => {
  const { id } = useParams();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = React.useState<Contact>(defaultValues);
  const [onFetchData, setOnFetchData] = React.useState<boolean>(Boolean(id));
  const [loading, setLoading] = React.useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!id) {
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await ContactRepository.show(id, {
      relations: ["groups"],
    })
      .then((resp: AxiosResponse<Resource<Contact>>) => {
        if (isMounted.current) {
          const { data: contact } = resp.data;

          Object.assign(contact, {
            name: contact.name || "",
            mobile_phone: contact.mobile_phone || "",
            address_line_1: contact.address_line_1 || "",
            address_line_2: contact.address_line_2 || "",
            country: contact.country || "",
            province: contact.province || "",
            city: contact.city || "",
            postal_code: contact.postal_code || "",
          });

          setGroups(contact.groups || []);
          setData(contact);
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

  const [groups, setGroups] = useState<Group[]>([]);
  const { handleSubmit, errors, setError, control, reset } = useForm<Contact>({
    mode: "onChange",
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        name: yup.string().nullable(true),
        mobile_phone: yup.string().nullable(true),
        address_line_1: yup.string().nullable(true),
        address_line_2: yup.string().nullable(true),
        country: yup.string().nullable(true),
        province: yup.string().nullable(true),
        city: yup.string().nullable(true),
        postal_code: yup.string().nullable(true),
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

  const onDeleteGroup = (indexDeleted: number[]) => {
    setGroups((nodes) =>
      nodes.filter((group, index) => !indexDeleted.includes(index))
    );
  };

  const onSelectedGroup = (group: Group | null) => {
    if (group === null) {
      return false;
    }

    setGroups((nodes) => [group, ...nodes]);
  };

  const onSubmit = async (formData: Group) => {
    setLoading(true);

    Object.assign(formData, {
      group_ids: groups.map((group) => group.id),
    });

    await (id
      ? ContactRepository.update(id, formData)
      : ContactRepository.create(formData)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
        }

        enqueueSnackbar(`Successfully ${id ? "Update" : "Create"} Contact`, {
          variant: "success",
        });

        navigate("/apps/audience?tab=0");
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
            onClick={() => navigate("/apps/audience?tab=0")}
          >
            <NavigateBefore />
          </MuiButtonIconRounded>
        </Box>
        <Typography variant={"h5"}>
          {id ? "Update " : "Create "} Contact
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MuiCard>
                <MuiCardHead>
                  <Typography variant={"h6"}>Information</Typography>
                </MuiCardHead>

                <MuiCardBody>
                  <Box py={1}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"email"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Email"}
                              error={_.has(errors, "email")}
                              helperText={_.get(errors, "email.message")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
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

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"mobile_phone"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Mobile Phone"}
                              error={_.has(errors, "mobile_phone")}
                              helperText={_.get(errors, "mobile_phone.message")}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </MuiCardBody>
              </MuiCard>
            </Grid>

            <Grid item xs={12}>
              <MuiCard>
                <MuiCardHead>
                  <Typography variant={"h6"}>Address</Typography>
                </MuiCardHead>

                <MuiCardBody>
                  <Box py={1}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Controller
                          control={control}
                          name={"address_line_1"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Address Line 1"}
                              error={_.has(errors, "address_line_1")}
                              helperText={_.get(
                                errors,
                                "address_line_1.message"
                              )}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          control={control}
                          name={"address_line_2"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Address Line 2"}
                              error={_.has(errors, "address_line_2")}
                              helperText={_.get(
                                errors,
                                "address_line_2.message"
                              )}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"country"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Country"}
                              error={_.has(errors, "country")}
                              helperText={_.get(errors, "country.message")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"province"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Province"}
                              error={_.has(errors, "province")}
                              helperText={_.get(errors, "province.message")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"city"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"City"}
                              error={_.has(errors, "city")}
                              helperText={_.get(errors, "city.message")}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name={"postal_code"}
                          render={({ ref, ...others }) => (
                            <MuiTextField
                              {...others}
                              inputRef={ref}
                              label={"Postal Code"}
                              error={_.has(errors, "postal_code")}
                              helperText={_.get(errors, "postal_code.message")}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </MuiCardBody>
              </MuiCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={4} xs={12}>
          <MuiCard>
            <MuiCardHead>
              <Typography variant={"h6"}>Group</Typography>
            </MuiCardHead>
            <MuiCardBody>
              <SearchContact
                selectedIds={
                  groups
                    .map((node) => node.id)
                    .filter((node) => node !== undefined) as string[]
                }
                onSelected={onSelectedGroup}
              />

              <Box mt={2}>
                <TableGroup groups={groups} onDelete={onDeleteGroup} />
              </Box>
            </MuiCardBody>
          </MuiCard>
        </Grid>

        <Grid item md={8} xs={12}>
          <MuiFormAction
            title={"Save changes?"}
            cancel={"Cancel"}
            save={"Save"}
            onCancel={() => navigate("/apps/audience?tab=0")}
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
  groups: any[];
  onDelete: (indexDeleted: number[]) => void;
}

const TableGroup = withStyles(() =>
  createStyles({
    overrides: {
      MuiTableCell: {
        body: {
          borderBottom: "unset !important",
        },
      },
    },
  })
)(({ groups, onDelete }: TableContactProps) => {
  const columns: MUIDataTableColumn[] = [
    {
      label: "Name",
      name: "name",
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
      data={groups}
      columns={columns}
      options={options}
      selectableRows={"multiple"}
    />
  );
});

interface ISearchContact {
  selectedIds: string[];
  onSelected: (group: Group) => void;
}

const SearchContact: React.FC<ISearchContact> = ({
  selectedIds,
  onSelected,
}) => {
  const filterOptions = (options: any, state: any) =>
    options.filter(
      (option: any) =>
        !selectedIds.includes(option.id) &&
        (state.inputValue ? option.name.search(state.inputValue) : 1) !== -1
    );

  return (
    <MuiAutoComplete
      repository={GroupRepository}
      onSelected={onSelected}
      filterOptions={filterOptions}
      disableCloseOnSelect={true}
      isKeepClear={true}
      muiTextField={{
        label: "Name",
      }}
    />
  );
};

export default ContactForm;
