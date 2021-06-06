import React, { useEffect, useState } from "react";
import { EmailCampaign } from "../../../../../models/EmailCampaign";
import { Group } from "../../../../../models/Group";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import _ from "lodash";
import MuiFormAction from "../../../../../components/ui/form/MuiFormAction";
import {
  Box,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
  withStyles,
} from "@material-ui/core";
import MuiCard from "../../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../../../components/ui/form/MuiTextField";
import { MUIDataTableColumn, MUIDataTableOptions } from "mui-datatables";
import { createStyles } from "@material-ui/core/styles";
import MuiDatatable from "../../../../../components/datatable/Index";
import MuiAutoComplete from "../../../../../components/ui/form/MuiAutoComplete";
import { GroupRepository } from "../../../../../repositories/GroupRepository";
import MuiDatePicker from "../../../../../components/ui/form/MuiDatePicker";
import MuiTimePicker from "../../../../../components/ui/form/MuiTimePicker";
import moment from "moment";

export interface EmailCampaignSettingData extends Partial<EmailCampaign> {}

interface FormSettingProps {
  data: EmailCampaign;
  errors: { [key: string]: any };
  onNext: (data: EmailCampaignSettingData) => void;
}

const FormSetting: React.FC<FormSettingProps> = (props) => {
  const { onNext, errors: feedBackErrors, data } = props;

  const { handleSubmit, errors, control, reset, watch } =
    useForm<EmailCampaignSettingData>({
      mode: "onChange",
      resolver: yupResolver(
        yup.object().shape({
          name: yup.string().required(),
          subject: yup.string().required(),
          from_name: yup.string().required().label("from name"),
          from: yup.string().required(),
          is_directly_send: yup.number().required(),
          send_date: yup.mixed().when("is_directly_send", {
            is: 0,
            then: yup.mixed().required().label("date"),
          }),
          send_time: yup.mixed().when("is_directly_send", {
            is: 0,
            then: yup.mixed().required().label("time"),
          }),
        })
      ),
      defaultValues: data,
    });

  useEffect(() => {
    reset(data);
    setGroups(data.groups || []);
  }, [data]);

  const [groups, setGroups] = useState<Group[]>([]);
  const onDeleteGroup = (indexDeleted: number[]) =>
    setGroups((nodes) =>
      nodes.filter((group, index) => !indexDeleted.includes(index))
    );

  const onSelectedGroup = (group: Group | null) => {
    if (group === null) {
      return false;
    }

    setGroups((nodes) => [group, ...nodes]);
  };

  const getError = (key: string) =>
    _.get(errors, key) || _.get(feedBackErrors, key);

  const hasError = (key: string) =>
    _.has(errors, key) || _.has(feedBackErrors, key);

  const isDirectlySend = watch("is_directly_send");

  const onSubmit = (formData: EmailCampaignSettingData) => {
    let sendAt = null;
    if (
      moment(formData.send_date).isValid() &&
      moment(formData.send_time).isValid()
    ) {
      const sendDateUTC = moment(formData.send_date).utc().format("YYYY-MM-DD");
      const sendTimeUTC = moment(formData.send_time)
        .utc()
        .format("HH:mm:ss.SSS");

      sendAt = `${sendDateUTC}T${sendTimeUTC}Z`;
    }

    Object.assign(formData, {
      send_at: sendAt,
      group_ids: groups.map((group) => group.id),
      groups: groups,
    });

    onNext(formData);
  };

  return (
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
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name={"name"}
                        render={({ ref, ...others }) => (
                          <MuiTextField
                            {...others}
                            inputRef={ref}
                            label={"Name"}
                            error={hasError("name")}
                            helperText={getError("name.message")}
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
                <Typography variant={"h6"}>Email Setting</Typography>
              </MuiCardHead>

              <MuiCardBody>
                <Box py={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name={"subject"}
                        render={({ ref, ...others }) => (
                          <MuiTextField
                            {...others}
                            inputRef={ref}
                            label={"Subject"}
                            error={hasError("subject")}
                            helperText={getError("subject.message")}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <Controller
                        control={control}
                        name={"from_name"}
                        render={({ ref, ...others }) => (
                          <MuiTextField
                            {...others}
                            inputRef={ref}
                            label={"From Name"}
                            error={hasError("from_name")}
                            helperText={getError("from_name.message")}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <Controller
                        control={control}
                        name={"from"}
                        render={({ ref, ...others }) => (
                          <MuiTextField
                            {...others}
                            inputRef={ref}
                            label={"From"}
                            error={hasError("from")}
                            helperText={getError("from.message")}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  @{data.domain}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name={"is_directly_send"}
                        defaultValue={data.is_directly_send}
                        render={({ value, onChange, ...others }) => (
                          <RadioGroup
                            {...others}
                            row
                            onChange={(event, newValue: string) =>
                              onChange(parseInt(newValue))
                            }
                            value={value}
                          >
                            <FormControlLabel
                              value={1}
                              control={<Radio color="primary" />}
                              label={"Send Immediately"}
                              checked={parseInt(value) === 1}
                              labelPlacement="end"
                            />
                            <FormControlLabel
                              value={0}
                              control={<Radio color="primary" />}
                              label={"Certain Time"}
                              checked={parseInt(value) === 0}
                              labelPlacement="end"
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>

                    {isDirectlySend ? null : (
                      <>
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name={"send_date"}
                            defaultValue={data.send_date}
                            render={({ ref, onChange, ...others }) => (
                              <MuiDatePicker
                                {...others}
                                inputRef={ref}
                                onChange={onChange}
                                margin={"normal"}
                                label={"Date"}
                                error={hasError("send_date")}
                                helperText={getError("send_date.message")}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name={"send_time"}
                            defaultValue={data.send_time}
                            render={({ ref, onChange, ...others }) => (
                              <MuiTimePicker
                                {...others}
                                inputRef={ref}
                                onChange={onChange}
                                margin={"normal"}
                                label={"Time"}
                                error={hasError("send_time")}
                                helperText={getError("send_time.message")}
                              />
                            )}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </MuiCardBody>
            </MuiCard>
          </Grid>

          <Grid item xs={12}>
            <MuiCard>
              <MuiCardHead>
                <Typography variant={"h6"}>Audience</Typography>
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
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <MuiFormAction
          title={"Next"}
          save={"Continue"}
          onSave={handleSubmit(onSubmit)}
        />
      </Grid>
    </Grid>
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

export default FormSetting;
