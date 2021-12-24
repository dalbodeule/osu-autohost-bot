import { BanchoUser } from 'bancho.js'
import { Beatmap } from 'nodesu'
// import { logger } from '..'
import nodesu from '../../lib/nodesu'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'
import { playerToMultiLobby } from '../lib/Multiplayer'
import * as ENUM from '../lib/enum'

export default class BeatmapCommand extends Command {
  public name = 'beatmap'
  public description = 'Search beatmap with beatmap id'
  public args = 'beatmap <beatmap> <mode>'

  private RegExp = /^(?:https:\/\/osu.ppy.sh\/b(?:eatmapsets\/.+)?\/)?(\d+)$/

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
        const beatmapId = this.RegExp.exec(args[1])

        if (beatmapId) {
          if (beatmapId[1]) {
            const result = (await nodesu.beatmaps.getByBeatmapId(
              beatmapId[1]
            )) as Beatmap[]

            if (result && result.length > 0) {
              let mode = lobby?.mode || ENUM.Mode.OSU

              if (args[2]) {
                switch (args[2]) {
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
              }

              lobby.addMap(result[0])
              if (mode != lobby.mode) lobby.setMode = mode
              void lobby.sendMessage(
                `add map name: ${result[0].title}(${result[0].difficultyName}) / ${result[0].difficultyRating} star`
              )
            }
          } else {
            void lobby.sendMessage(`map not found!`)
          }
        } else {
          void user.sendMessage(`${args[1]} is not beatmap id or url`)
        }
      } else {
        void user.sendMessage(`<arg1: beatmap id/url> is null.`)
      }
    }
  }
}
