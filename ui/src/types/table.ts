// SortDirection describes the direction of sort.
export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

// ColumnConfig is a config for a table column.
//
// T is the enum of sort keys.
export interface ColumnConfig<T> {
  label: string;
  key: string;
  sortBy: T;
  align: "left" | "right" | "center";
}
