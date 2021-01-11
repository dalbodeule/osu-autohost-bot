import { Message, User } from 'discord.js'

export default abstract class Command {
  public name = ''
  public description = ''

  public abstract commandHandler(
    msg: Message,
    user: User,
    args: string[]
  ): Promise<void>
}
