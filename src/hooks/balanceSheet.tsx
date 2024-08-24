"use client";

import { useEffect, useMemo, useState } from "react";
import { API_HOST } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { ITableHeader } from "@/components/customTable";
import {
  BalanceSheetData,
  FormattedBalanceSheetRow,
} from "@/types/balanceSheet";

const useBalanceSheet = () => {
  const [data, setData] = useState<BalanceSheetData[] | null>(null);
  const fetchBalanceSheet = async () => {
    try {
      const url = `${API_HOST}/api/v1/balance-sheet`;
      const result = await axios.get(url);
      if (result?.data?.Status !== "OK") return toast("Failed to get data.");
      return setData(result?.data?.Reports);
    } catch {
      toast("Failed to get data.");
    }
  };

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    let formattedColumns: ITableHeader[] = [];

    for (let obj of data) {
      for (let row of obj?.Rows) {
        if (row?.RowType !== "Header") continue;
        for (let i in row?.Cells) {
          formattedColumns = [
            ...formattedColumns,
            {
              key: i,
              label: row?.Cells[i]?.Value,
            },
          ];
        }
      }
    }

    return formattedColumns;
  }, [data]);

  const formattedDataMemo = useMemo(() => {
    if (!data) return null
    if (data.length === 0) return [];
    if (!columns || columns.length === 0) return [];

    const columnsLen = columns?.length;
    let formattedData: FormattedBalanceSheetRow[] = [];
    for (let obj of data) {
      for (let row of obj?.Rows) {
        if (row?.RowType === "Header") continue; // Header will be defined in another place
        let titleRow = {
          ...Array(columnsLen).fill(""), // Filling the rest with empty strings
        };
        titleRow[0] = row?.Title;
        // Section Title
        formattedData = [...formattedData, titleRow];

        // Data formatting
        for (let data of row?.Rows) {
          let formattedRow: FormattedBalanceSheetRow = {};
          formattedRow[0] = data?.Cells[0]?.Value;

          for (let i = 1; i < columnsLen; i++) {
            formattedRow[i] = data?.Cells[i]?.Value || "";
          }

          formattedData = [...formattedData, formattedRow];
        }
      }
    }

    return formattedData;
  }, [data, columns]);

  return {
    columns: columns,
    data: formattedDataMemo,
  };
};

export default useBalanceSheet;
