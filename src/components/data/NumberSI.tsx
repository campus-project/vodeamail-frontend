import React from "react";
import { useSelector } from "react-redux";

interface INumberSI {
  data: string | number;
  defaultValue?: string;
}

const NumberSI: React.FC<INumberSI> = ({ data, defaultValue = "" }) => {
  const { numberLocale } = useSelector(({ formatter }: any) => ({
    numberLocale: formatter.numberLocale,
  }));

  const value = typeof data === "number" ? data : parseFloat(data);
  if (isNaN(value)) {
    return <>{defaultValue}</>;
  }

  return (
    <>
      {Math.abs(Number(value)) >= 1.0e9
        ? (Math.abs(Number(value)) / 1.0e9).toLocaleString(numberLocale) + "B"
        : Math.abs(Number(value)) >= 1.0e6
        ? (Math.abs(Number(value)) / 1.0e6).toLocaleString(numberLocale) + "M"
        : Math.abs(Number(value)) >= 1.0e3
        ? (Math.abs(Number(value)) / 1.0e3).toLocaleString(numberLocale) + "K"
        : Math.abs(Number(value))}
    </>
  );
};

export default NumberSI;
