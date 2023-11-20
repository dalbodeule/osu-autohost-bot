import { BanchoUser } from 'bancho.js'
import { /* client, */ logger } from '..'
import Config from '../../config'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Commands'
import { multiplayerList } from '../lib/Multiplayer'

export default class ExitCommand extends Command {
  public name = 'exit'
  public description = ''
  public args = ''

  public async commandHandler(
    user: BanchoUser,
    _args: string[],
    _where: CommandWhereExecutied,
    _role: CommandExecutorRole
  ): Promise<void> {
    logger.info(`exit from ${user.username || user.ircUsername}`)
    if (
      user.username == Config.osu.username ||
      user.ircUsername == Config.osu.username
    ) {
      logger.info(`all of room is close! (${multiplayerList.size})`)
      await user.sendMessage(`all of room is close! (${multiplayerList.size})`)

      multiplayerList.forEach((value) => {
        void value.close()
        logger.info(`room ${value.id}(${value.name}) is closed!`)
      })

      process.exit(0)
    }
  }
}
