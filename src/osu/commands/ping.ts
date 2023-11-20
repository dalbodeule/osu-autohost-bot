import { BanchoUser } from 'bancho.js'

import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Commands'

export default class PingCommand extends Command {
  public name = 'Ping'
  public arg = ''
  public description = 'Ping commands.'

  // eslint-disable-next-line @typescript-eslint/require-await
  public async commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    role: CommandExecutorRole
  ): Promise<void> {
    void user.sendMessage('!pong')
  }
}
