import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
}

export const DataTable = <T,>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) => (
  <Paper>
    <Table size="small">
      <TableHead>
        <TableRow>{columns.map((column) => <TableCell key={column.key}>{column.title}</TableCell>)}</TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>{columns.map((column) => <TableCell key={column.key}>{column.render(row)}</TableCell>)}</TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);
