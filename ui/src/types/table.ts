// SortDirection describes the direction of sort.
export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

// TableColumn is a config for a table column.
export interface TableColumn {
  key: string;
  label: string;
  align: "left" | "right" | "center";
}

// SortableTableColumn is a config for a table column
// for table with sorting support.
//
// T is the enum of sort keys.
export interface SortableTableColumn<T> extends TableColumn {
  sortBy: T;
}
