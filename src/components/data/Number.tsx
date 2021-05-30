import React from "react";
import { useSelector } from "react-redux";

interface INumber {
  data: string | number;
  defaultValue?: string;
  suffix?: string;
  prefix?: string;
}

const Number: React.FC<INumber> = ({
  data,
  prefix,
  suffix,
  defaultValue = "",
}) => {
  const { numberLocale } = useSelector(({ formatter }: any) => ({
    numberLocale: formatter.numberLocale,
  }));

  const value = typeof data === "number" ? data : parseFloat(data);
  return (
    <>
      {prefix || ""}
      {isNaN(value) ? defaultValue : value.toLocaleString(numberLocale)}
      {suffix || ""}
    </>
  );
};

export default Number;
