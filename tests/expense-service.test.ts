import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { ExpenseService } from '../src/service/expense-service.js';
import { InMemoryExpenseRepository } from '../src/repository/in-memory-expense-repository.js';
import { ExpenseNotFoundError } from '../src/errors/expense-not-found-error.js';
import { formatExpenses } from '../src/cli/formatter.js';


describe('ExpenseService', () => {
  let repository: InMemoryExpenseRepository;
  let service: ExpenseService;

  beforeEach(() => {
    repository = new InMemoryExpenseRepository();
    service = new ExpenseService(repository);
  });

  it('should create an expense', async () => {
    const expense = await service.createExpense({
      amount: 100,
      category: 'food',
      description: 'Pizza',
    });

    expect(expense).toEqual({
      id: 1,
      amount: 100,
      category: 'food',
      description: 'Pizza',
      createdAt: expect.any(String),
    });
  });

  it('should delete an expense', async () => {
    await service.createExpense({
      amount: 100,
      category: 'food',
      description: 'Pizza',
    });

    await service.deleteExpense(1);

    await expect(
      service.getExpenseById(1),
    ).resolves.toBeUndefined();
  });

  it('should throw when deleting non-existent expense', async () => {
    await expect(
      service.deleteExpense(999),
    ).rejects.toThrow(ExpenseNotFoundError);
  });

  it('should find expense by id', async () => {
    await service.createExpense({
      amount: 100,
      category: 'food',
      description: 'Pizza',
    });

    const expense = await service.getExpenseById(1);

    expect(expense).toEqual({
      id: 1,
      amount: 100,
      category: 'food',
      description: 'Pizza',
      createdAt: expect.any(String),
    });
  });

  it('should return undefined when expense does not exist', async () => {
    await expect(
      service.getExpenseById(999),
    ).resolves.toBeUndefined();
  });

  it('should return all expenses', async () => {
    await service.createExpense({
      amount: 100,
      category: 'food',
      description: 'Pizza',
    });

    await service.createExpense({
      amount: 200,
      category: 'health',
      description: 'Medicine',
    });

    const expenses = await service.getExpenses();

    expect(expenses).toHaveLength(2);
  });
  it('should calculate expense stats', async () => {
    await service.createExpense({
      amount: 100,
      category: 'food',
      description: 'Pizza',
    });
  
    await service.createExpense({
      amount: 50,
      category: 'food',
      description: 'Burger',
    });
  
    await service.createExpense({
      amount: 30,
      category: 'health',
      description: 'Medicine',
    });
  
    const stats = await service.getStats();
  
    expect(stats).toEqual({
      total: 180,
      byCategory: {
        food: 150,
        transport: 0,
        entertainment: 0,
        shopping: 0,
        health: 30,
        other: 0,
      },
    });
  });

  it('should return empty stats when there are no expenses', async () => {
    const stats = await service.getStats();
  
    expect(stats).toEqual({
      total: 0,
      byCategory: {
        food: 0,
        transport: 0,
        entertainment: 0,
        shopping: 0,
        health: 0,
        other: 0,
      },
    });
  });
});

describe('formatExpenses', () => {
  it('should format expenses as table', () => {
    const result = formatExpenses([
      {
        id: 1,
        amount: 100,
        category: 'food',
        description: 'Pizza',
        createdAt: '2026-08-24T12:00:00.000Z',
      },
    ]);

    expect(result).toContain('food');
    expect(result).toContain('100.00');
    expect(result).toContain('Pizza');
  });
});
//describe - блок тестов
//it - один тест 
//expect().toEqual() - для сравнения результатов