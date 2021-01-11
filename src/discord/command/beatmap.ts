import { Message, MessageEmbed, User } from 'discord.js'
import { Beatmap } from 'nodesu'
import nodesu from '../../lib/nodesu'
import Command from '../lib/Command'

export default class BeatmapCommand extends Command {
  public name = 'beatmap'
  public description = 'Search beatmap with beatmap id'

  private RegEx = /^(?:https:\/\/osu.ppy.sh\/b(?:eatmapsets\/.+)?\/)?(\d+)$/

  public async commandHandler(
    msg: Message,
    user: User,
    args: string[]
  ): Promise<void> {
    if (args.length > 0) {
      const beatmapId = args[1].match(this.RegEx)

      if (beatmapId && beatmapId[1]) {
        const result = (await nodesu.beatmaps.getByBeatmapId(
          beatmapId[1]
        )) as Beatmap[]

        if (result && result.length > 0) {
          const beatmapEmbed = new MessageEmbed()
            .setColor('#dc98a4')
            .setTitle(`${result[0].title} - ${result[0].artist}`)
            .setURL(`https://osu.ppy.sh/b/${result[0].id}`)
            .addFields([
              {
                name: 'diff',
                value: `${
                  result[0].difficultyName
                } - ${result[0].difficultyRating.toFixed(2)} star`,
              },
              {
                name: 'creator',
                value: result[0].creator,
              },
            ])
            .setTimestamp()

          msg.channel.send(beatmapEmbed)
        } else {
          msg.channel.send(`map not found! ${user}`)
        }
      } else {
        msg.channel.send(`${args[1]} is not beatmap id or url! ${user}`)
      }
    } else {
      msg.channel.send(`<arg1: beatmap id/url> is null. ${user}`)
    }
  }
}
