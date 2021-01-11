import dotenv from 'dotenv'
import Logger from './logger'
import * as path from 'path'

interface IConfig {
  readonly osu: {
    readonly apiKey: string,
    readonly username: string,
    readonly ircpass: string
  },
  readonly discord: {
    readonly apiKey: string,
    readonly guildId: number
  }
}

const logger = new Logger('Config')

try {
  dotenv.config({
    path: path.resolve(__dirname, '../.env')
  })

  logger.info("use .env files!")
} catch {
  logger.info("use proces.env objects!")
}

const Config: IConfig = {
  osu: {
    apiKey: process.env.OSU_APIKEY || "",
    username: process.env.OSU_USERNAME || "",
    ircpass: process.env.OSU_IRCPASS || ""
  },
  discord: {
    apiKey: process.env.DISCORD_APIKEY || "",
    guildId: parseInt(process.env.DISCORD_GUILDID || "0")
  }
}

export default Config
