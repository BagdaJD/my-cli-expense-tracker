import type { Expense } from '../domain/expense.js'

export interface ExpenseRepository{
  findAll(): Promise<Expense[]>;
  findById(id: number): Promise<Expense | undefined>;
  create(expense: Expense): Promise<Expense>;
  delete(id: number): Promise<void>;
}