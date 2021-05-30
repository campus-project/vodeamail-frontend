import "date-fns";
import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

export interface MuiDatePickerProps extends KeyboardDatePickerProps {}

const MuiDatePicker = withStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
)((props: MuiDatePickerProps) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <KeyboardDatePicker
      format="dd/MM/yyyy"
      fullWidth
      inputVariant="outlined"
      {...props}
    />
  </MuiPickersUtilsProvider>
));

export default MuiDatePicker;
