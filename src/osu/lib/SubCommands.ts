import { BanchoUser } from 'bancho.js'
import { CommandWhereExecutied, CommandExecutorRole } from './Commands'
import Multiplayer from './Multiplayer'

export default abstract class SubCommand {
  protected name = ''
  protected arg = ''
  protected description = ''

  public abstract commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    role: CommandExecutorRole,
    room?: Multiplayer
  ): void
}
