import {
  type Expense,
  type CreateExpenseInput,
  isExpenseCategory,
  type ExpenseCategory
} from '../domain/expense.js'

import {type ExpenseRepository} from '../repository/expense-repository.js'
import { ExpenseNotFoundError } from '../errors/expense-not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';
import type { ExpenseStats } from './expense-stats.js';

export class ExpenseService{
  constructor(private readonly repository: ExpenseRepository) { }

  async getExpenses(): Promise<Expense[]> {
    return this.repository.findAll();
  }

  async getExpenseById(id: number): Promise<Expense | undefined> {
    return this.repository.findById(id);
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    if (input.amount <= 0) {
      throw new ValidationError("Amount must be greater than 0");
    }
  
    if (input.description.trim() === "") {
      throw new ValidationError("Description cannot be empty");
    }

    if (!isExpenseCategory(input.category)) {
      throw new ValidationError("Invalid category");
    }
    
    const expenses = await this.repository.findAll();
    const nextId = expenses.length > 0 ? Math.max(...expenses.map(expense => expense.id)) + 1 : 1;
    const expense: Expense = {
      id: nextId,
      ...input, //идет копирование свойств из input
      createdAt: new Date().toISOString()
    }
    
    return this.repository.create(expense);
  }

  async deleteExpense(id: number): Promise<void> {
    const del = await this.repository.delete(id);

    if (!del) throw new ExpenseNotFoundError("Expense not found")
  }

  async getStats(): Promise<ExpenseStats>{
    const expenses = await this.repository.findAll();
    const stats = expenses.reduce<ExpenseStats>(
      (result, expense) => {
        result.total += expense.amount;
        result.byCategory[expense.category] += expense.amount;
    
        return result;
      },
      {
        total: 0,
        byCategory: {
          food: 0,
          transport: 0,
          entertainment: 0,
          shopping: 0,
          health: 0,
          other: 0,
        },
      },
    );

    return stats;
  }
  //await здесь не нужен, т.к нам не нужно в repository передавать 
  // конечный результат
}

