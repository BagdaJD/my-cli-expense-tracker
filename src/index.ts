import { JsonExpenseRepository } from "./repository/json-expense-repository.js";
import { ExpenseService } from "./service/expense-service.js";
import { executeCommand } from "./cli/commands.js";
import { parseCommands } from './cli/parser.js';

const repository = new JsonExpenseRepository();
const service = new ExpenseService(repository);
//const [, , command, argument] = process.argv;

//получаем команды из командной строки
// т.е первые две команды нам не нужны, т.к это pnpm dev
// дальнейший функционал будет зависеть от третьей команды 
//command - сама команда, argument - аргумент
try {
  const input = parseCommands();
  await executeCommand(input, service)
} catch (error) {
  console.error(error);
  process.exit(1);
}
