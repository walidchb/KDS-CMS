import React, { JSX } from "react";

import { IColumnType } from "./Table";
import get from "lodash.get";

interface Props<T> {
  columns: IColumnType<T>[];
  secondary?: boolean;
  data: T[];
}

export function TableHeader<T>({
  data,
  columns,
  secondary,
}: Props<T>): JSX.Element {
  return (
    <tr>
      {columns.map((column, columnIndex) => {
        // console.log('colllll');
        // console.log(column);
        const value = get(column, column.key);

        if (column.renderTitle) {
          return (
            <th
              key={`table-head-cell-${columnIndex}`}
              style={{ width: "auto" }}
              className={`${
                secondary ? "bg-blue-50" : "bg-blue-100"
              }  p-3   font-medium text-left text-md text-gray-800 ${
                columnIndex === 0 ? "rounded-tl-lg" : ""
              } ${columnIndex === columns.length - 1 ? "rounded-tr-lg" : ""}`}
            >
              {column.render ? column.renderTitle(data) : value}
            </th>
          );
        } else {
          return (
            <th
              key={`table-head-cell-${columnIndex}`}
              style={{ width: "auto" }}
              className={`${
                secondary ? "bg-blue-50" : "bg-blue-100"
              } p-3 font-medium text-left text-md text-gray-800 ${
                columnIndex === 0 ? "rounded-tl-lg" : ""
              } ${columnIndex === columns.length - 1 ? "rounded-tr-lg" : ""}`}
            >
              {column.title}
            </th>
          );
        }
      })}
    </tr>
  );
}
