import { BanchoUser } from 'bancho.js'

export enum CommandWhereExecutied {
  ROOM = 'ROOM',

  DM = 'DM',
}

export enum CommandExecutorRole {
  ROOM_MASTER = 'ROOM_MASTER',
  NORMAL = 'NORMAL',
}

export default abstract class Command {
  public name = ''
  public description = ''

  public abstract commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    role: CommandExecutorRole
  ): Promise<void>
}
