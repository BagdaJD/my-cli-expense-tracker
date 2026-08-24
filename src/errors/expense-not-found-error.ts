export class ExpenseNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpenseNotFoundError';
  }
}