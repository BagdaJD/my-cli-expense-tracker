import type { ExpenseRepository } from "./expense-repository.js";
import type { Expense, ExpenseCategory } from "../domain/expense.js";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile } from "node:fs/promises";

export class JsonExpenseRepository implements ExpenseRepository{
  
  async findAll(): Promise<Expense[]> {
    const currentFilePath = fileURLToPath(import.meta.url)
    //import.meta.url
    //file:///home/user/project/dist/repository/json-expense-repository.js
   
    //fileURLToPath
    ///home/user/project/dist/repository/json-expense-repository.js

    const currDir = dirname(currentFilePath)
    ///home/user/project/dist/repository
    
    const filePath = join(currDir, "../../data/expenses.json")

    const content = await readFile(filePath, 'utf-8')
    const data: unknown = JSON.parse(content) 

    //проверка на то, что data - массив
    if (!Array.isArray(data)) {
      throw new Error('Invalid expenses data');
    }

    //проверка на то, что каждый элемент массива - Expense
    if (!data.every(isExpense)) {
      throw new Error('Invalid expense data');
    }
    
    return data;
  }
  
  findById(id: number): Promise<Expense | undefined> {
    return Promise.resolve(undefined);
  }
  
  create(expense: Expense): Promise<Expense> {
    return Promise.resolve(expense);  
  }
  
  delete(id: number): Promise<void> {
    return Promise.resolve();
  }
}

function isExpense(value: unknown): value is Expense {
    return typeof value === 'object' && value !== null &&
      'id' in value && typeof value.id === 'number' &&
      'amount' in value && typeof value.amount === 'number' &&
      'description' in value && typeof value.description === 'string' &&
      'createdAt' in value && typeof value.createdAt === 'string' &&
      'category' in value && isExpenseCategory(value.category) 
}

function isExpenseCategory(value: unknown): value is ExpenseCategory{
  return (typeof value === 'string') && value === 'food' ||
    value === 'transport' ||
    value === 'entertainment' ||
    value === 'shopping' ||
    value === 'health' ||
    value === 'other'
}