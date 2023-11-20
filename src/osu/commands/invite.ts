import { BanchoUser } from 'bancho.js'
import { client, logger } from '..'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Commands'
import Multiplayer from '../lib/Multiplayer'
import wait from '../lib/wait'

export default class InviteCommand extends Command {
  public name = 'invite'
  public description = ''
  public args = '!invite <username>'

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
      await wait(1)
      const inviteUser = client.getUser(args[1])

      await room.invite(inviteUser)
    } catch (error) {
      void room.sendMessage(`${args[1]} not found!`)
    }
  }
}
