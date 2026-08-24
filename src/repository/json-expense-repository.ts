import type { ExpenseRepository } from "./expense-repository.js";
import {type Expense, isExpenseCategory } from "../domain/expense.js";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFile, writeFile } from "node:fs/promises";
import { InvalidDataError } from "../errors/invalid-data-error.js";

export class JsonExpenseRepository implements ExpenseRepository{
  readonly #filePath: string;

  constructor() {
    const currFilePath = fileURLToPath(import.meta.url);
    const currDir = dirname(currFilePath);
    //import.meta.url
    //file:///home/user/project/dist/repository/json-expense-repository.js
   
    //fileURLToPath
    ///home/user/project/dist/repository/json-expense-repository.js

    //const currDir = dirname(currentFilePath)
    ///home/user/project/dist/repository

    this.#filePath = join(currDir, '../../data/expenses.json');
  }
  
  async findAll(): Promise<Expense[]> {
    const content = await readFile(this.#filePath, 'utf-8')
    const data: unknown = JSON.parse(content) 

    //проверка на то, что data - массив
    if (!Array.isArray(data)) {
      throw new InvalidDataError('Invalid expenses data');
    }

    //проверка на то, что каждый элемент массива - Expense
    if (!data.every(isExpense)) {
      throw new InvalidDataError('Invalid expense data');
    }
    
    return data;
  }
  
  async findById(id: number): Promise<Expense | undefined> {
    const expenses = await this.findAll();
    
    return expenses.find(expense => expense.id === id);
  }
  
  async create(expense: Expense): Promise<Expense> {
    const data = await this.findAll()
    data.push(expense)

    const content = JSON.stringify(data, null, 2)
    //обратно конвертирует массив объектов в json
    //JSON.stringify(value, replacer, space)
    // null, 2 - для красивого форматирования
    await writeFile(this.#filePath, content, 'utf-8')
    return expense;  
  }
  
  async delete(id: number): Promise<boolean> {
    const data = await this.findAll();
    const exist = data.some(expense => expense.id === id);

    if (!exist) return false;
    const filteredData = data.filter(expense => expense.id !== id)

    const content = JSON.stringify(filteredData, null, 2)
    await writeFile(this.#filePath, content, 'utf-8')
    return true;
  }
}

//оставляем эту функцию здесь по скольку помогает 
//с распознованием самих данных
function isExpense(value: unknown): value is Expense {
    return typeof value === 'object' && value !== null &&
      'id' in value && typeof value.id === 'number' &&
      'amount' in value && typeof value.amount === 'number' &&
      'description' in value && typeof value.description === 'string' &&
      'createdAt' in value && typeof value.createdAt === 'string' &&
      'category' in value && isExpenseCategory(value.category) 
}
