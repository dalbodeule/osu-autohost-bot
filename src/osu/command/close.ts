import { BanchoUser } from 'bancho.js'
import { /* client, */ logger } from '..'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'
import Multiplayer from '../lib/Multiplayer'
import wait from '../lib/wait'

export default class CloseCommand extends Command {
  public name = 'close'
  public description = ''
  public args = ''

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    _role: CommandExecutorRole,
    room: Multiplayer
  ): Promise<void> {
    if (where != CommandWhereExecutied.ROOM) {
      void user.sendMessage(`this command is must be room`)
      return
    }

    try {
      if (!room.master || user.id == room.master?.id) {
        await room.sendMessage('room close within 5 secs')
        await room.close()
      } else {
        await room.sendMessage(
          `${user.username || user.ircUsername} is not room master`
        )
      }
    } catch (error) {
      logger.debug(error)
    }
  }
}
