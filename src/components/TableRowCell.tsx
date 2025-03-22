import React, { JSX } from "react";
import get from "lodash.get";
import { IColumnType } from "./Table";

interface Props<T> {
  item: T;
  column: IColumnType<T>;
}

export function TableRowCell<T>({ item, column }: Props<T>): JSX.Element {
  const value = get(item, column.key);
  return (
    <td className="p-3 text-md border-2 border-white text-black text-left bg-gray-100">
      {column.render ? column.render(column, item) : value}
    </td>
  );
}
