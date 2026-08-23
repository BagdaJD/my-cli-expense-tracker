export type ExpenseCategory = | 'food'
  | 'transport'
  | 'entertainment' 
  | 'shopping'
  | 'health'
  | 'other'

export interface Expense {
  id: number,
  amount: number,
  category: ExpenseCategory,
  description: string,
  createdAt: string
}

export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt'>

export function isExpenseCategory(input: unknown): input is ExpenseCategory{
  return typeof input === 'string' &&(
      input === 'food' ||
      input === 'transport' ||
      input === 'entertainment' ||
      input === 'shopping' ||
      input === 'health' ||
      input === 'other'
    );
}
//пишем эту функцию в domain по скольку 
//она проверяет непосредственно свойство expense