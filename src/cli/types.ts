export const commands = ['list', 'get', 'delete', 'add'] as const;

export type Command = typeof commands[number];
 
export interface ParsedCommand {
  command: Command | undefined;
  args: string[];
}

export function isCommand(input: unknown): input is Command {
  return typeof input === 'string' &&
    (commands as readonly string[]).includes(input);
}