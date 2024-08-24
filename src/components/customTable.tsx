import { Input, Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { useCallback, useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

export interface ITableHeader {
  key: string;
  label: string;
}

interface ICustomTable {
  label?: string;
  columns: ITableHeader[];
  rows: any;
}

export const CustomTable = (props: ICustomTable) => {
  const { label = "custom-table", columns, rows = [] } = props;
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const rowsPerPage = 10;
  const pages = rows ? Math.ceil(rows.length / rowsPerPage) : 0;

  const filteredItems = useMemo(() => {
    if (!rows) return [];
    if (!filterValue || filterValue === "") return rows;
    return rows.filter((item: any) => {
      // Convert object values to string and check if any include the filterValue
      return Object.values(item).some((val: any) =>
        val
          ? val.toString().toLowerCase().includes(filterValue.toLowerCase())
          : val
      );
    });
  }, [rows, filterValue]);

  const items = useMemo(() => {
    if (!filteredItems) return [];
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 shadow-md">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search"
          startContent={<IoSearchOutline className="text-black" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>

      {/* Table */}
      <Table
        aria-label={label}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] shadow-md w-full",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody emptyContent={"No rows to display."} items={items}>
          {(item: any) => (
            <TableRow key={Math.random().toString(36).substr(2, 9)}>
              {(columnKey) => (
                <TableCell className="text-black">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
