import React from "react";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables";
import { Box, CircularProgress, Grid } from "@material-ui/core";
import MuiDatatableSearch, { MuiDatatableSearchProps } from "./Search";
import { MuiTextFieldProps } from "../ui/form/MuiTextField";

const defaultMuiDatatableOption = {
  rowsPerPageOptions: [5, 10, 20, 50],
  serverSide: true,
  filter: false,
  print: false,
  download: false,
  search: false,
  viewColumns: false,
  elevation: 0,
};

export interface IMuiDatatable extends Omit<MUIDataTableProps, "title"> {
  data: any[];
  columns: any[];
  title?: string;
  loading?: boolean;
  //input search
  inputSearch?: MuiTextFieldProps & MuiDatatableSearchProps;

  //datatable
  onTableChange?: MUIDataTableOptions["onTableChange"];
  selectableRows?: MUIDataTableOptions["selectableRows"];
  disableServerSide?: boolean;
}

export interface IMuiDatatableColumn extends MUIDataTableColumn {
  columnName?: string;
}

const MuiDatatable: React.FC<IMuiDatatable> = (props) => {
  const {
    columns,
    data,
    title = "",
    loading = false,
    //search
    inputSearch,

    //datatable
    options,
    onTableChange,
    selectableRows,
    disableServerSide = false,

    ...other
  } = props;

  const handleTableChange = (action: string, tableState: any) => {
    if (onTableChange !== undefined) {
      if (tableState?.sortOrder?.name) {
        const muiDatatableColumn = columns.find(
          (column) =>
            column.name === tableState?.sortOrder?.name && !!column.columnName
        );
        if (muiDatatableColumn) {
          tableState.sortOrder.columnName = muiDatatableColumn.columnName;
        }
      }

      onTableChange(action, tableState);
    }
  };

  const muiDatatableOption = defaultMuiDatatableOption;
  if (disableServerSide) {
    muiDatatableOption.serverSide = false;
  }

  return (
    <>
      {inputSearch ? (
        <Box px={2} pb={2}>
          <Grid container spacing={3} alignItems={"center"}>
            <Grid item md={2} xs={12}>
              <MuiDatatableSearch {...inputSearch} />
            </Grid>
          </Grid>
        </Box>
      ) : null}

      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={{
          ...(options ?? {}),
          ...muiDatatableOption,
          onTableChange: handleTableChange,
          selectableRows: selectableRows || "none",
          responsive: "simple",
          textLabels: {
            body: {
              noMatch: loading ? (
                <Box>
                  <CircularProgress size={30} color={"inherit"} />
                </Box>
              ) : (
                "Sorry, no matching records found"
              ),
            },
          },
        }}
        {...other}
      />
    </>
  );
};

export default MuiDatatable;
