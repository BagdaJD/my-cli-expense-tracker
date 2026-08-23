import {
  type Expense,
  type CreateExpenseInput,
  isExpenseCategory
} from '../domain/expense.js'

import {type ExpenseRepository} from '../repository/expense-repository.js'


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
      throw new Error("Amount must be greater than 0");
    }
  
    if (input.description.trim() === "") {
      throw new Error("Description cannot be empty");
    }

    if (!isExpenseCategory(input.category)) {
      throw new Error("Invalid category")
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

    if (!del) throw new Error("Expense not found")
  }
  //await здесь не нужен, т.к нам не нужно в repository передавать 
  // конечный результат
}