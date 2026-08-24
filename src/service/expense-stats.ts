import type { ExpenseCategory } from "../domain/expense.js";

export interface ExpenseStats {
  total: number,
  byCategory: Record<ExpenseCategory, number>
}