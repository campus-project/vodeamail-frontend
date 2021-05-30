import { useEffect, useState } from "react";
import { insertQuerySearch } from "../helpers/common.helper";
import { useQuerySearch } from "./query-search.hook";

export const useQueryTab = (maxTab: number) => {
  const { tab: queryTab = 0 } = useQuerySearch();
  const [tab, setTab] = useState<number>(
    queryTab !== null && queryTab < maxTab ? Number(queryTab) : 0
  );

  useEffect(() => {
    setTimeout(() => {
      insertQuerySearch("tab", tab);
    }, 1);
  }, [tab]);

  return {
    tab,
    setTab,
  };
};
