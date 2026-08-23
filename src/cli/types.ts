export type Command =  | 'list'
 | 'get'
 | 'delete'
 | 'add';

 
export interface ParsedCommand {
  command: Command | undefined;
  args: string[];
}
