import { BanchoUser } from 'bancho.js'
import { client, logger } from '..'
import Config from '../../config'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'

export default class CloseIDCommand extends Command {
  public name = 'closeID'
  public description = ''
  public args = 'closeID <roomID>'

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    _where: CommandWhereExecutied,
    _role: CommandExecutorRole
  ): Promise<void> {
    logger.info(`close from ${user.username || user.ircUsername} - ${args[1]}`)
    if (
      user.username == Config.osu.username ||
      user.ircUsername == Config.osu.username
    ) {
      const multi = client.getChannel(`#mp_${args[1]}`)

      try {
        await multi.join()

        logger.info(multi.name)

        await multi.sendMessage('!mp close')
        logger.info(`room ${multi.name} is closed`)
        await user.sendMessage(`room ${multi.name} is closed`)
      } catch (err) {
        logger.info(`room ${multi.name} not find`)
        await user.sendMessage(`room ${multi.name} not find`)
      }
    }
  }
}
