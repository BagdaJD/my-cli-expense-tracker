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