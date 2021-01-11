import Logger from '../logger'
import config from '../config'
import bancho from 'bancho.js'

const logger = new Logger('OSU');

(async() => {
  logger.info('process start!')

  try {
    const client = new bancho.BanchoClient({
      apiKey: config.osu.apiKey,
      username: config.osu.username,
      password: config.osu.ircpass,
    })

    await client.connect()
    logger.info(`connect success! - ${client.getSelf().ircUsername}`)

    client.on('PM', msg => {
      logger.info(`${msg.user.ircUsername} - ${msg.message}`)
    })

    setInterval(() => {
      logger.debug(`client is connected: ${client.isConnected()}`)
    }, 10000)
  } catch (error) {
    logger.warn('error!')
    logger.debug(error)
  }
})()