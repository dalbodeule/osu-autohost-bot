import { BanchoUser } from 'bancho.js'
// import { logger } from '..'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'
import { playerToMultiLobby } from '../lib/Multiplayer'
import * as ENUM from '../lib/enum'

export default class ModeCommand extends Command {
  public name = 'mode'
  public description = 'set mode'
  public args = 'mode <mode>'

  // eslint-disable-next-line @typescript-eslint/require-await
  public async commandHandler(
    user: BanchoUser,
    args: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    where: CommandWhereExecutied,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _role: CommandExecutorRole
  ): Promise<void> {
    if (where != CommandWhereExecutied.ROOM) {
      void user.sendMessage(`this command must be run in room`)
      return
    }
    const lobby = playerToMultiLobby.get(user.id)
    if (lobby) {
      if (args.length > 0) {
        let mode = lobby?.mode || ENUM.Mode.OSU

        if (args[1]) {
          switch (args[1].toLocaleUpperCase()) {
            case ENUM.Mode.MANIA.toString():
            case 'MANIA':
              mode = ENUM.Mode.MANIA
              break
            case ENUM.Mode.CTB.toString():
            case 'CTB':
              mode = ENUM.Mode.CTB
              break
            case ENUM.Mode.TAIKO.toString():
            case 'TAIKO':
              mode = ENUM.Mode.TAIKO
              break
            case ENUM.Mode.OSU.toString():
            case 'OSU':
            default:
              mode = ENUM.Mode.OSU
              break
          }

          if (mode != lobby.mode) lobby.setMode = mode
          void lobby.sendMessage(`set mode: ${ENUM.Mode[mode]}`)
        } else {
          void user.sendMessage(`<arg1: beatmap id/url> is null.`)
        }
      }
    }
  }
}
