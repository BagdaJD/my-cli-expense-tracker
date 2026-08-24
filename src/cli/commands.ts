import type { ExpenseService } from '../service/expense-service.js';
import type { ParsedCommand } from './types.js';
import { parseId, parseArgs } from './parser.js';
import { ExpenseNotFoundError } from '../errors/expense-not-found-error.js';
import {
  formatExpenses,
  formatStats,
} from './formatter.js';


export async function executeCommand(command: ParsedCommand, service: ExpenseService): Promise<void>{
  switch (command.command) {
    case 'list':
      const expenses = await service.getExpenses();
      console.log(formatExpenses(expenses));
      
      break;
    case 'get':
      const id = parseId(command.args, command.command);
      const expense = await service.getExpenseById(id);
      
      if (!expense) {
        throw new ExpenseNotFoundError(`Expense with id ${id} not found`);
      }
      console.log(expense);
      
      break;
    case 'delete':
      const deleteId = parseId(command.args, command.command);
      await service.deleteExpense(deleteId);
      console.log(`Expense with id ${deleteId} deleted`)
      
      break;
    case 'add':
      const input = parseArgs(command.args);
      const newExpense = await service.createExpense(input);
      console.log(newExpense);

      break;
      case 'stats': {
        const stats = await service.getStats();
      
        console.log(formatStats(stats));
      
        break;
      }
      
    case undefined:
    case 'help':{
    console.log(`
        Expense Tracker
  
        Usage:
          pnpm dev list
          pnpm dev get <id>
          pnpm dev add --amount <amount> --category <category> --description <description>
          pnpm dev delete <id>
          pnpm dev help
  
        Commands:
          list     Show all expenses
          get      Show expense by id
          add      Create a new expense
          delete   Delete an expense
          help     Show this help
          ` );
      break;
    }
  }
}