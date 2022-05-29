import { Message, MessageEmbed, User } from 'discord.js'
import { Beatmap } from 'nodesu'
import nodesu from '../../lib/nodesu'
import Command from '../lib/Command'
import * as ENUM from '../../osu/lib/enum'

export default class BeatmapCommand extends Command {
  public name = 'beatmap'
  public description = 'Search beatmap with beatmap id'

  private RegExp = /^(?:https:\/\/osu.ppy.sh\/b(?:eatmapsets\/.+)?\/)?(\d+)$/

  public async commandHandler(
    msg: Message,
    user: User,
    args: string[]
  ): Promise<void> {
    if (args.length > 0) {
      const beatmapId = this.RegExp.exec(args[1])

      if (beatmapId && beatmapId[1]) {
        const result = (await nodesu.beatmaps.getByBeatmapId(
          beatmapId[1]
        )) as Beatmap[]

        if (result && result.length > 0) {
          const beatmapEmbed = new MessageEmbed()
            .setColor('#dc98a4')
            .setTitle(`${result[0].title} - ${result[0].artist}`)
            .setURL(`https://osu.ppy.sh/b/${result[0].id}`)
            .setImage(
              `https://assets.ppy.sh/beatmaps/${result[0].beatmapSetId}/covers/cover.jpg`
            )
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
              {
                name: 'mode',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: ENUM.Mode[result[0].mode || 0],
              },
              {
                name: 'Max Combo',
                value: `${result[0].maxCombo} Combo`,
              },
            ])
            .setTimestamp()
            .setFooter({
              text: 'osu.ppy.sh',
            })

          void msg.channel.send({ embeds: [beatmapEmbed] })
        } else {
          void msg.channel.send(`map not found! ${user.toString()}`)
        }
      } else {
        void msg.channel.send(
          `${args[1]} is not beatmap id or url! ${user.toString()}`
        )
      }
    } else {
      void msg.channel.send(
        `<arg1: beatmap id/url> is null. ${user.toString()}`
      )
    }
  }
}
