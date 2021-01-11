import { BanchoUser } from 'bancho.js'
import { Beatmap } from 'nodesu'
import nodesu from '../../lib/nodesu'
import Command, {
  CommandExecutorRole,
  CommandWhereExecutied,
} from '../lib/Command'

export default class BeatmapCommand extends Command {
  public name = 'beatmap'
  public description = 'Search beatmap with beatmap id'

  private RegEx = /^(?:https:\/\/osu.ppy.sh\/b(?:eatmapsets\/.+)?\/)?(\d+)$/

  public async commandHandler(
    user: BanchoUser,
    args: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _where: CommandWhereExecutied,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _role: CommandExecutorRole
  ): Promise<void> {
    if (args.length > 0) {
      const beatmapId = args[1].match(this.RegEx)

      if (beatmapId && beatmapId[1]) {
        const result = (await nodesu.beatmaps.getByBeatmapId(
          beatmapId[1]
        )) as Beatmap[]

        if (result && result.length > 0) {
          user.sendMessage(
            `map name: ${result[0].title}(${result[0].difficultyName}) / ${result[0].difficultyRating} star`
          )
        } else {
          user.sendMessage(`map not found!`)
        }
      } else {
        user.sendMessage(`${args[1]} is not beatmap id or url`)
      }
    } else {
      user.sendMessage(`<arg1: beatmap id/url> is null.`)
    }
  }
}
