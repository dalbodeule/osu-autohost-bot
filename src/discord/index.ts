import Logger from '../logger'
import config from '../config'
import discord, { Intents } from 'discord.js'

import formattedCommandList from './command'

const logger = new Logger('DISCORD')

void (async () => {
  logger.info('process start!')

  const client = new discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  })

  client.on('messageCreate', async (msg) => {
    if (!msg.author.bot && msg.channel.id == config.discord.commandId) {
      logger.info(`${msg.author.username} - ${msg.content}`)

      const splittedMsg = msg.content.split(' ')

      if (
        msg.content.startsWith(config.commandPrefix) &&
        formattedCommandList.get(splittedMsg[0].toLowerCase())
      ) {
        await formattedCommandList
          .get(splittedMsg[0])
          ?.commandHandler(msg, msg.author, splittedMsg)
      }
    }
  })

  await client.login(config.discord.apiKey)
  logger.info(`connect success! - ${client.user?.username || ''}`)
})()
