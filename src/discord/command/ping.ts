import { Message, User } from 'discord.js'
import Command from '../lib/Command'

export default class Ping extends Command {
  public name = 'Ping'
  public arg = ''
  public description = 'Ping commands.'

  public async commandHandler(
    msg: Message,
    user: User,
    args: string[]
  ): Promise<void> {
    msg.reply(`pong!`)
  }
}
