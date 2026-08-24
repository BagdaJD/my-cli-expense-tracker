//для тестов expenseService
import type { ExpenseRepository } from "./expense-repository.js";
import type { Expense } from "../domain/expense.js";

export class InMemoryExpenseRepository implements ExpenseRepository {
   #expenses: Expense[] = [];

  async findAll(): Promise<Expense[]> {
    return this.#expenses;
  }

  async findById(id: number): Promise<Expense | undefined> {
    return this.#expenses.find(
      expense => expense.id === id
    );
  }

  async create(expense: Expense): Promise<Expense> {
    this.#expenses.push(expense);

    return expense;
  }

  async delete(id: number): Promise<boolean> {
    const exist = this.#expenses.some(expense => expense.id === id);

    if (!exist) return false;
    this.#expenses = this.#expenses.filter(expense => expense.id !== id);

    return true;
  }
  
  // findAll(): Promise<Expense[]>;
  // findById(id: number): Promise<Expense | undefined>;
  // create(expense: Expense): Promise<Expense>;
  // delete(id: number): Promise<boolean>;
}