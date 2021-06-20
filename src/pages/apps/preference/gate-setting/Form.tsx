import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GateSetting } from "../../../../models/GateSetting";
import { useParams } from "react-router";
import { useIsMounted } from "../../../../utilities/hooks/mounted.hook";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { GateSettingRepository } from "../../../../repositories/GateSettingRepository";
import { AxiosResponse } from "axios";
import { Resource } from "../../../../interfaces/Resource";
import {
  axiosErrorHandler,
  axiosErrorSaveHandler,
} from "../../../../utilities/helpers/axios.helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Permission } from "../../../../models/Permission";
import { Transaction } from "../../../../models/Transaction";
import { TransactionRepository } from "../../../../repositories/TransactionRepository";
import moment from "moment";
import _ from "lodash";
import Loading from "../../../../components/ui/Loading";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import MuiButtonIconRounded from "../../../../components/ui/button/MuiButtonIconRounded";
import { NavigateBefore } from "@material-ui/icons";
import MuiCard from "../../../../components/ui/card/MuiCard";
import MuiCardHead from "../../../../components/ui/card/MuiCardHead";
import MuiCardBody from "../../../../components/ui/card/MuiCardBody";
import MuiTextField from "../../../../components/ui/form/MuiTextField";
import MuiFormAction from "../../../../components/ui/form/MuiFormAction";
import MuiDatePicker from "../../../../components/ui/form/MuiDatePicker";
import { RoleRepository } from "../../../../repositories/RoleRepository";
import MuiAutoComplete from "../../../../components/ui/form/MuiAutoComplete";
import { Autocomplete, Skeleton } from "@material-ui/lab";

const defaultValues: GateSetting = {
  name: "",
  valid_from: new Date(),
  role_id: null,
  permission_ids: [],
};

interface IPermissionAbility {
  [key: string]: Permission[];
}

const GateSettingForm: React.FC<any> = () => {
  const { id } = useParams();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<GateSetting>(defaultValues);
  const [onFetchData, setOnFetchData] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState<boolean>(false);

  const [transactionPermission, setTransactionPermission] =
    useState<IPermissionAbility>({});
  const [defaultTransactionPermission, setDefaultTransactionPermission] =
    useState<IPermissionAbility>({});

  const [onLoadTransaction, setOnLoadTransaction] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransaction = useCallback(async () => {
    if (isMounted.current) {
      setOnLoadTransaction(true);
    }

    await TransactionRepository.all({
      order_by: "transaction.name",
      relations: ["permissions"],
    })
      .then((resp: AxiosResponse<Resource<Transaction[]>>) => {
        if (isMounted.current) {
          const { data } = resp.data;

          setTransactions(data);
          setOnLoadTransaction(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnLoadTransaction(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });
  }, [false]);

  const loadData = useCallback(async () => {
    if (!id) {
      await loadTransaction().then();
      return;
    }

    if (isMounted.current) {
      setOnFetchData(true);
    }

    await GateSettingRepository.show(id, {
      relations: ["role", "permissions"],
    })
      .then((resp: AxiosResponse<Resource<GateSetting>>) => {
        if (isMounted.current) {
          const { data: gateSetting } = resp.data;

          if (gateSetting.permissions !== undefined) {
            const selectedPermissionAbility: IPermissionAbility = {};

            gateSetting.permissions.forEach((permission) => {
              if (permission.id !== undefined) {
                if (
                  typeof selectedPermissionAbility[
                    permission.transaction_id
                  ] === "undefined"
                ) {
                  selectedPermissionAbility[permission.transaction_id] = [];
                }

                selectedPermissionAbility[permission.transaction_id].push(
                  permission
                );
              }
            });

            setTransactionPermission(selectedPermissionAbility);
            setDefaultTransactionPermission(selectedPermissionAbility);
          }

          Object.assign(gateSetting, {
            role_id: gateSetting.role,
          });

          setData(gateSetting);
          setOnFetchData(false);
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setOnFetchData(false);
          axiosErrorHandler(e, enqueueSnackbar);
        }
      });

    await loadTransaction().then();
  }, [false]);

  const { handleSubmit, errors, setError, control, reset } =
    useForm<GateSetting>({
      mode: "onChange",
      resolver: yupResolver(
        yup.object().shape({
          name: yup.string().required(),
          valid_from: yup.mixed().required().label("valid from"),
          role_id: yup.mixed().required().label("role"),
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

  const onSubmit = async (formData: GateSetting) => {
    setLoading(true);

    const permissionIds: string[] = [];

    Object.values(transactionPermission).forEach((permissions) => {
      const selectedPermissionIds: string[] = [];
      permissions.forEach((permission) => {
        if (permission.id !== undefined) {
          selectedPermissionIds.push(permission.id);
        }
      });

      permissionIds.push(...selectedPermissionIds);
    });

    formData.valid_from = moment(formData.valid_from).isValid()
      ? moment(formData.valid_from).format()
      : "";
    formData.role_id = _.get(formData, "role_id.id");
    formData.permission_ids = permissionIds;

    await (id
      ? GateSettingRepository.update(id, formData)
      : GateSettingRepository.create(formData)
    )
      .then(() => {
        if (isMounted.current) {
          setLoading(false);

          enqueueSnackbar(
            `Successfully ${id ? "update" : "create"} gate setting.`,
            {
              variant: "success",
            }
          );

          navigate("/apps/preference/gate-setting");
        }
      })
      .catch((e: any) => {
        if (isMounted.current) {
          setLoading(false);

          axiosErrorSaveHandler(e, setError, enqueueSnackbar);
        }
      });
  };

  const handleChangePermission = (
    transactionId: string,
    permissions: Permission[]
  ) => {
    setTransactionPermission((nodes) => ({
      ...nodes,
      [transactionId]: permissions,
    }));
  };

  return (
    <>
      {onFetchData ? <Loading /> : null}
      <Box style={onFetchData ? { display: "none" } : {}}>
        <Box
          mb={3}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <Box mr={1.5}>
            <MuiButtonIconRounded
              onClick={() => navigate("/apps/preference/gate-setting")}
            >
              <NavigateBefore />
            </MuiButtonIconRounded>
          </Box>
          <Typography variant={"h5"}>
            {id ? "Update " : "Create "} Gate Setting
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
                        <Grid item xs={6}>
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

                        <Grid item xs={6}>
                          <Controller
                            control={control}
                            name={"valid_from"}
                            defaultValue={data.valid_from || new Date()}
                            render={({ ref, onChange, ...others }) => (
                              <MuiDatePicker
                                {...others}
                                inputRef={ref}
                                onChange={onChange}
                                label={"Valid From"}
                                error={_.has(errors, "valid_from")}
                                helperText={_.get(errors, "valid_from.message")}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            control={control}
                            name={"role_id"}
                            render={({ value, onChange }) => {
                              return (
                                <MuiAutoComplete
                                  value={value}
                                  repository={RoleRepository}
                                  params={{ special: 0 }}
                                  onSelected={(value) => onChange(value)}
                                  muiTextField={{
                                    label: "Role",
                                  }}
                                />
                              );
                            }}
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
                    <Typography variant={"h6"}>Permission</Typography>
                  </MuiCardHead>

                  <MuiCardBody>
                    <Box py={1}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          {onLoadTransaction ? (
                            <PermissionLoaderSkeleton />
                          ) : (
                            <Table>
                              <TableBody>
                                {transactions.map((transaction) => {
                                  const options =
                                    transaction.permissions === undefined
                                      ? []
                                      : _.orderBy(
                                          transaction.permissions,
                                          ["ability"],
                                          ["asc"]
                                        );

                                  const defaultValue =
                                    transaction.id === undefined
                                      ? []
                                      : defaultTransactionPermission[
                                          transaction.id
                                        ] || [];

                                  return (
                                    <TableRow key={transaction.id}>
                                      <TableCell width={200}>
                                        <Typography>
                                          {transaction.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Autocomplete
                                          defaultValue={defaultValue}
                                          options={options}
                                          getOptionLabel={(option) =>
                                            _.get(option, "ability")
                                          }
                                          getOptionSelected={(option, value) =>
                                            _.get(option, "id") ===
                                            _.get(value, "id")
                                          }
                                          multiple
                                          disableCloseOnSelect
                                          onChange={(event, value) =>
                                            handleChangePermission(
                                              _.get(transaction, "id", ""),
                                              value
                                            )
                                          }
                                          renderInput={(params) => (
                                            <MuiTextField
                                              {...params}
                                              label={"Ability"}
                                            />
                                          )}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          )}
                        </Grid>
                      </Grid>
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
              onCancel={() => navigate("/apps/preference/gate-setting")}
              onSave={handleSubmit(onSubmit)}
              saveDisable={loading}
              saveLoading={loading}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const PermissionLoaderSkeleton = () => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Skeleton height={56} style={{ width: "35%" }} />
        <Skeleton height={56} style={{ width: "60%" }} />
      </Box>

      <Box display={"flex"} justifyContent={"space-between"}>
        <Skeleton height={56} style={{ width: "35%" }} />
        <Skeleton height={56} style={{ width: "60%" }} />
      </Box>

      <Box display={"flex"} justifyContent={"space-between"}>
        <Skeleton height={56} style={{ width: "35%" }} />
        <Skeleton height={56} style={{ width: "60%" }} />
      </Box>
    </Box>
  );
};

export default GateSettingForm;
