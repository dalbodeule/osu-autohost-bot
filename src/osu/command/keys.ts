import { BanchoMod, BanchoMods, BanchoModsTypes, BanchoUser } from 'bancho.js'
import { client, logger } from '..'
import Config from '../../config'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'
import Multiplayer from '../lib/Multiplayer'
import * as ENUM from '../lib/enum'

export default class KeysCommand extends Command {
  public name = 'keys'
  public description = ''
  public args = 'keys <1-9>'

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    where: CommandWhereExecutied,
    _role: CommandExecutorRole,
    lobby?: Multiplayer
  ): Promise<void> {
    if (where != CommandWhereExecutied.ROOM) {
      void user.sendMessage(`this command must be run in room`)
      return
    }
    if (lobby) {
      if (args.length > 0) {
        if (lobby.mode == ENUM.Mode.MANIA) {
          let mods: BanchoMod | undefined = undefined

          switch (parseInt(args[1])) {
            case 1:
              mods = BanchoMods.Key1
              break
            case 2:
              mods = BanchoMods.Key2
              break
            case 3:
              mods = BanchoMods.Key3
              break
            case 4:
              mods = BanchoMods.Key4
              break
            case 5:
              mods = BanchoMods.Key5
              break
            case 6:
              mods = BanchoMods.Key6
              break
            case 8:
              mods = BanchoMods.Key8
              break
            case 9:
              mods = BanchoMods.Key9
              break
            case 10:
              mods = BanchoMods.Key10
              break
            case 7:
            default:
              mods = BanchoMods.Key7
              break
          }

          lobby.removeMods([
            BanchoMods.Key1,
            BanchoMods.Key2,
            BanchoMods.Key3,
            BanchoMods.Key4,
            BanchoMods.Key5,
            BanchoMods.Key6,
            BanchoMods.Key7,
            BanchoMods.Key8,
            BanchoMods.Key9,
            BanchoMods.Key10,
          ])
          lobby.addMods([mods])
        } else {
          await lobby.sendMessage(`this room's mode is not MANIA`)
        }
      }
    }
  }
}
