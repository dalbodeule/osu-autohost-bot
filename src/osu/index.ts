import Logger from '../logger'
import config from '../config'
import bancho from 'bancho.js'
import formattedCommandList from './command'
import { CommandExecutorRole, CommandWhereExecutied } from './lib/Command'

const logger = new Logger('OSU')

;(async () => {
  logger.info('process start!')

  try {
    const client = new bancho.BanchoClient({
      username: config.osu.username,
      password: config.osu.ircpass,
    })

    await client.connect()
    logger.info(`connect success! - ${client.getSelf().ircUsername}`)

    client.on('PM', async (msg) => {
      logger.info(`${msg.user.ircUsername} - ${msg.message}`)

      const splittedMsg = msg.message.split(' ')

      if (
        msg.message.startsWith(config.commandPrefix) &&
        formattedCommandList.get(splittedMsg[0].toLowerCase())
      ) {
        await formattedCommandList
          .get(splittedMsg[0])
          ?.commandHandler(
            msg.user,
            splittedMsg,
            CommandWhereExecutied.DM,
            CommandExecutorRole.NORMAL
          )
      }
    })
  } catch (error) {
    logger.warn('error!')
    logger.debug(error)
  }
})()

export { logger }
