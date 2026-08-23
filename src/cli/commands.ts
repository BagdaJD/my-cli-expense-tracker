import type { ExpenseService } from '../service/expense-service.js';
import type { ParsedCommand } from './types.js';

function parseId(arr: string[], command: string) {
  const argument = arr[0];
  if (!argument) {
    console.error(`Usage: pnpm dev ${command} <id>`);
    process.exit(1);
  }

  const id = Number(arr[0]);
  if (!Number.isInteger(id) || id <= 0) {
    console.error('Incorrect id');
    process.exit(1);
  }

  return id;
}

export async function executeCommand(command: ParsedCommand, service: ExpenseService): Promise<void>{
  switch (command.command) {
    case 'list':
      const data = await service.getExpenses();
      console.log(data);
      break;
    case 'get':
      const id = parseId(command.args, command.command);
      const expense = await service.getExpenseById(id);
      if (!expense) {
        console.error(`Expense with id ${id} not found`);
        return;
      }
      
      console.log(expense);
      break;
    case 'delete':
      const deleteId = parseId(command.args, command.command);
      try {
        await service.deleteExpense(deleteId);
        console.log(`Expense with id ${deleteId} deleted`)
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      console.error('Unknown command');
      process.exit(1);
  }
}