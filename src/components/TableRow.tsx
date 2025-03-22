import React, { JSX } from "react";
import { IColumnType } from "./Table";

import { TableRowCell } from "./TableRowCell";

interface Props<T> {
  data: T[];
  columns: IColumnType<T>[];
  action?: "relancer" | "annuler" | "print" | null;
}

export function TableRow<T>({ data, columns }: Props<T>): JSX.Element {
  return (
    <>
      {data?.map((item: T, itemIndex) => {
        return (
          <tr
            key={` table-body-${itemIndex}`}
            className={`bg-gray-200  divide-gray-300 border border-white ${
              itemIndex === data.length - 1 ? "rounded-bl-lg rounded-br-lg" : ""
            }`}
          >
            {columns.map((column, columnIndex) => (
              <TableRowCell
                key={`table-row-cell-${columnIndex}`}
                item={item}
                column={column}
              />
            ))}
          </tr>
        );
      })}
    </>
  );
}
