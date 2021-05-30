import React from "react";
import { useSelector } from "react-redux";

interface IPercentage {
  data: string | number;
  defaultValue?: string | number;
}

const Percentage: React.FC<IPercentage> = ({ data, defaultValue = "" }) => {
  const { numberLocale } = useSelector(({ formatter }: any) => ({
    numberLocale: formatter.numberLocale,
  }));

  const value = typeof data === "number" ? data : parseFloat(data);
  return (
    <>{isNaN(value) ? defaultValue : value.toLocaleString(numberLocale)}%</>
  );
};

export default Percentage;
