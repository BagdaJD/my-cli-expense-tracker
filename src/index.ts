import { JsonExpenseRepository } from "./repository/json-expense-repository.js";
import { ExpenseService } from "./service/expense-service.js";

const repository = new JsonExpenseRepository();
const service = new ExpenseService(repository);
const [, , command, argument] = process.argv;

//получаем команды из командной строки
// т.е первые две команды нам не нужны, т.к это pnpm dev
// дальнейший функционал будет зависеть от третьей команды 
//command - сама команда, argument - аргумент

if (command === 'list') {
  const expenses = await service.getExpenses();
  console.log(expenses);
}

if (command === 'get') {
  if (!argument) {
    console.error('Usage: pnpm dev get <id>');
    process.exit(1);
  }

  const id = Number(argument)
  if (!Number.isInteger(id) || id <= 0) {
    console.error('Incorrect id');
    process.exit(1);
  }
  
  const expense = await service.getExpenseById(id)
  if(typeof expense === 'undefined') console.log('Expense not found')
  console.log(expense)
}

if (command === 'delete') {
  if (!argument) {
    console.error('Usage: pnpm dev delete <id>');
    process.exit(1);
  }

  const id = Number(argument)
  if (!Number.isInteger(id) || id <= 0) {
    console.error('Incorrect id');
    process.exit(1);
  }
  try {
    await service.deleteExpense(id);
    console.log(`Expense with id ${id} deleted`)
  } catch (error) {
    console.error(error);
  }
}