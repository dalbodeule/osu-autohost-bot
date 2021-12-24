import Logger from '../logger'
import config from '../config'
import bancho from 'bancho.js'
import formattedCommandList from './command'
import { CommandExecutorRole, CommandWhereExecutied } from './lib/Command'
import { multiplayerList } from './lib/Multiplayer'

const logger = new Logger('OSU')
const client = new bancho.BanchoClient({
  username: config.osu.username,
  password: config.osu.ircpass,
  apiKey: config.osu.apiKey,
})

void (async () => {
  logger.info('process start!')

  try {
    await client.connect()
    logger.info(`connect success! - ${client.getSelf().ircUsername}`)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    client.on('PM', async (msg): Promise<void> => {
      // logger.info(`${msg.user.ircUsername} - ${msg.message}`)

      const splittedMsg = msg.message.split(' ')

      if (
        msg.message.startsWith(config.commandPrefix) &&
        formattedCommandList.get(splittedMsg[0].toLowerCase())
      ) {
        await formattedCommandList
          .get(splittedMsg[0].toLowerCase())
          ?.commandHandler(
            msg.user,
            splittedMsg,
            CommandWhereExecutied.DM,
            CommandExecutorRole.NORMAL,
            undefined
          )
      }
    })

    client.on('JOIN', (member) => {
      logger.info(`JOIN ${member.channel.name}`)
    })
    client.on('PART', (member) => {
      logger.info(`PART ${member.channel.name}`)
    })

    client.on('error', (error) => {
      console.error(error)
    })
  } catch (error) {
    logger.warn('error!')
    logger.debug(error as string)
  }
})()
;[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  multiplayerList.forEach((value) => {
    void value.close()
    logger.info(`room ${value.id}(${value.name}) is closed!`)
  })
  logger.info(`all of room is closed. (${multiplayerList.size})`)
})

export { logger, client }
