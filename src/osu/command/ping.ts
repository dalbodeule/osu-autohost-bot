import { BanchoUser } from 'bancho.js'

import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'

export default class Ping extends Command {
  public name = 'Ping'
  public arg = ''
  public description = 'Ping commands.'

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    role: CommandExecutorRole
  ): Promise<void> {
    user.sendMessage('!pong')
  }
}
