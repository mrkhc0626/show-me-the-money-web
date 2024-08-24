export type FormattedBalanceSheetRow = {
  [key: number]: string; // Dynamic keys with string values
};

interface Attribute {
  Value: string;
  Id: string;
}

interface Cell {
  Value: string;
  Attributes?: Attribute[];
}

interface Row {
  RowType: "Header" | "Section" | "Row" | "SummaryRow";
  Title: string;
  Cells: Cell[];
  Rows: Row[];
}

export interface BalanceSheetData {
  ReportID: string;
  ReportName: string;
  ReportType: string;
  ReportTitles: string[];
  ReportDate: string;
  UpdatedDateUTC: string;
  Fields: any[]; // Assuming Fields is an empty array or could be more defined later
  Rows: Row[];
}
