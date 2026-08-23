import type { ParsedCommand, Command } from './types.js';

function isCommand(value: string): value is Command {
  return (
    value === 'list' ||
    value === 'get' ||
    value === 'delete' ||
    value === 'add'
  );
}

export function parseCommands(): ParsedCommand  {
  const [, , command, ...args] = process.argv;
  if(command === undefined) {
    return { command: undefined, args: [] };
  }
  
  if (!isCommand(command)) {
    throw new Error(`Unknown command: ${command}`);
  }

  
  return {
    command: command,
    args,
  };
}