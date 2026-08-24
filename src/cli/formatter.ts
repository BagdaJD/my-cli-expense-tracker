import type { Expense } from '../domain/expense.js';

import type { ExpenseStats } from '../service/expense-stats.js';

type TableRow = string[];

function padRow(row: TableRow, widths: number[]): string {
  return row
    .map((cell, index) => cell.padEnd(widths[index] as number))
    .join('  ');
}

function formatTable(headers: TableRow, rows: TableRow[]): string {
  const widths = headers.map((header, index) => {
    const values = rows.map((row) => row[index] ?? '');

    return Math.max(
      header.length,
      ...values.map((value) => value.length),
    );
  });

  return [
    padRow(headers, widths),
    ...rows.map((row) => padRow(row, widths)),
  ].join('\n');
}

export function formatExpenses(expenses: Expense[]): string {
  if (expenses.length === 0) {
    return 'No expenses found.';
  }

  const headers = [
    'ID',
    'CATEGORY',
    'AMOUNT',
    'DESCRIPTION',
    'CREATED AT',
  ];

  const rows = expenses.map((expense) => [
    String(expense.id),
    expense.category,
    expense.amount.toFixed(2),
    expense.description,
    new Date(expense.createdAt).toLocaleString(),
  ]);

  return formatTable(headers, rows);
}

export function formatStats(stats: ExpenseStats): string {
  const rows = Object.entries(stats.byCategory).map(
    ([category, amount]) => [
      category,
      amount.toFixed(2),
    ],
  );

  return [
    `Total: ${stats.total.toFixed(2)}`,
    '',
    formatTable(
      ['CATEGORY', 'AMOUNT'],
      rows,
    ),
  ].join('\n');
}