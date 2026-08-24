import {
  type ParsedCommand,
  isCommand,
} from './types.js';

import {
  type CreateExpenseInput,
  isExpenseCategory,
} from '../domain/expense.js';

import { ValidationError } from '../errors/validation-error.js';

export function parseId(arr: string[], command: string): number {
  const argument = arr[0];

  if (argument === undefined) {
    throw new ValidationError(`Usage: pnpm dev ${command} <id>`);
  }

  const id = Number(argument);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Incorrect id');
  }

  return id;
}

export function parseArgs(args: string[]): CreateExpenseInput {
  const data: Partial<CreateExpenseInput> = {};

  for (let i = 0; i < args.length; i++) {
    const argument = args[i];
    switch (argument) {
      case '--amount': {
        const value = args[++i];

        if (value === undefined) {
          throw new ValidationError('Missing value for --amount');
        }

        const amount = Number(value);

        if (!Number.isFinite(amount) || amount <= 0) {
          throw new ValidationError('Amount must be a positive number');
        }

        data.amount = amount;
        break;
      }

      case '--category': {
        const value = args[++i];

        if (value === undefined) {
          throw new ValidationError('Missing value for --category');
        }

        if (!isExpenseCategory(value)) {
          throw new ValidationError(`Invalid category: ${value}`);
        }

        data.category = value;
        break;
      }

      case '--description': {
        const value = args[++i];

        if (value === undefined) {
          throw new ValidationError('Missing value for --description');
        }

        if (value.trim() === '') {
          throw new ValidationError('Description cannot be empty');
        }

        data.description = value;
        break;
      }

      default:
        throw new ValidationError(`Unknown argument: ${argument}`);
    }
  }

  if (data.amount === undefined) {
    throw new ValidationError('Missing --amount argument');
  }

  if (data.category === undefined) {
    throw new ValidationError('Missing --category argument');
  }

  if (data.description === undefined) {
    throw new ValidationError('Missing --description argument');
  }

  return {
    amount: data.amount,
    category: data.category,
    description: data.description,
  };
}

export function parseCommands(): ParsedCommand {
  const [, , command, ...args] = process.argv;

  if (command === undefined) {
    return {
      command: undefined,
      args: [],
    };
  }

  if (!isCommand(command)) {
    throw new ValidationError(`Unknown command: ${command}`);
  }

  return {
    command,
    args,
  };
}
