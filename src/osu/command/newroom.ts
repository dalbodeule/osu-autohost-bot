import { BanchoUser } from 'bancho.js'
import { client, logger } from '..'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'
import Multiplayer from '../lib/Multiplayer'
import wait from '../lib/wait'

export default class NewRoomCommand extends Command {
  public name = 'newroom'
  public description = 'Create new room.'
  public args = '<roomname> [password]'

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    _where: CommandWhereExecutied,
    _role: CommandExecutorRole
  ): Promise<void> {
    if (args && args[1]) {
      const newLobby = await client.createLobby(args[1])

      const lobby = new Multiplayer(client, newLobby, user, args[2])

      logger.info(`room ${args[1]} is created.`)
      await Promise.all([
        user.sendMessage(`room ${args[1]} is created.`),
        lobby.invite(user),
      ])

      try {
        await wait(3)
        await lobby.invite(user)
      } catch (error) {
        void lobby.sendMessage(`${args[1]} not found!`)
      }
    } else {
      await user.sendMessage('please enter room name.')
    }
  }
}
