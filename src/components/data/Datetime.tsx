import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";

interface IDatetime {
  data: string;
  defaultValue?: string;
}

const Datetime: React.FC<IDatetime> = ({ data, defaultValue = "" }) => {
  const { datetime } = useSelector(({ formatter }: any) => ({
    datetime: formatter.datetime,
  }));

  const value = moment(data);
  return <>{value.isValid() ? value.format(datetime) : defaultValue}</>;
};

export default Datetime;
