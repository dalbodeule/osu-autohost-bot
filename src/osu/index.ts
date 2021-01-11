import Logger from '../logger'
import config from '../config'
import bancho from 'bancho.js'

const logger = new Logger('OSU');

(async() => {
  logger.info('process start!')

  try {
    const client = new bancho.BanchoClient({
      apiKey: config.osu.apiKey,
      username: 'dalbodeule',
      password: 'e54af48a',
    })

    await client.connect()
    logger.info(`connect success! - ${client.getSelf().ircUsername}`)

    client.on('PM', msg => {
      logger.info(`${msg.user} - ${msg.message}`)
    })
  } catch (error) {
    logger.warn('error!')
    logger.debug(error)
  }
})()