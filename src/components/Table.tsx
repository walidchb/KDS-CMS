import React, { JSX } from "react";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

export interface IColumnType<T> {
  key: string;
  title: string;
  width?: number;
  render?: (column: IColumnType<T>, item: T) => void;
  renderTitle?: (column: unknown) => void;
}

interface Props<T> {
  data: T[];
  columns: IColumnType<T>[];
  action?: "relancer" | "annuler" | "print" | null;
  secondary?: boolean;
}

export function Table<T>({
  data,
  columns,
  action,
  secondary,
}: Props<T>): JSX.Element {
  return (
    <table className="custom-table border-collapse border-none">
      <thead>
        <TableHeader secondary={secondary} columns={columns} data={data} />
      </thead>
      <tbody>
        <TableRow data={data} columns={columns} action={action} />
      </tbody>
    </table>
  );
}
