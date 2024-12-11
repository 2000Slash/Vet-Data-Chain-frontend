import React from 'react';
import { useTable, useFilters, Column } from 'react-table';

interface TableRow {
  [key: string]: any; 
}

interface TableColumn {
  key: string; // The identifier for the column
  title: string; // The title of the column to display
}

interface TableProps {
  rowContent: TableRow[]; 
  columnData: TableColumn[]; 
}

const Table: React.FC<TableProps> = ({ rowContent, columnData }) => {
  // Transform the columnData into the format expected by react-table
  const columns = React.useMemo(
    () => 
      columnData.map((col) => ({
        Header: col.title,
        accessor: col.key, // Accessor is the key to access data in each row
      })),
    [columnData]
  );

  const data = React.useMemo(() => rowContent, [rowContent]);

  // Use the useTable hook provided by react-table
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows, 
    prepareRow 
  } = useTable({ columns, data }, useFilters);

  return (
    <table {...getTableProps()} style={{ border: '1px solid black', width: '100%' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} style={{ borderBottom: '2px solid black', padding: '10px' }}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} style={{ borderBottom: '1px solid gray', padding: '10px' }}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
