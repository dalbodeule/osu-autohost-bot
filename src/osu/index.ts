import Logger from '../logger'
import bancho from 'bancho.js'

import config from '../config'
import formattedCommandList from './commands'
import { CommandExecutorRole, CommandWhereExecutied } from './lib/Commands'
import { multiplayerList } from './lib/Multiplayer'

export const logger = new Logger('OSU')
export const client = new bancho.BanchoClient({
  username: config.osu.username,
  password: config.osu.ircpass,
  apiKey: config.osu.apiKey,
})

const startBot = async () => {
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
}

export default startBot
