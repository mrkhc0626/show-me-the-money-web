"use client";

import { CustomTable } from "@/components/customTable";
import useBalanceSheet from "@/hooks/balanceSheet";

export default function Home() {
  const { columns, data } = useBalanceSheet();
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-12">
      <h1>Show Me the Money Balance Sheet</h1>

      {columns.length > 0 && (
        <CustomTable
          label="balance-sheet-table"
          columns={columns}
          rows={data}
        />
      )}
    </main>
  );
}
