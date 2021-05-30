import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";

interface IDate {
  data: string;
  defaultValue?: string;
}

const Date: React.FC<IDate> = ({ data, defaultValue = "" }) => {
  const { date } = useSelector(({ formatter }: any) => ({
    date: formatter.date,
  }));

  const value = moment(data);
  return <>{value.isValid() ? value.format(date) : defaultValue}</>;
};

export default Date;
