import { Client, IntentsBitField, Interaction } from 'discord.js'
import Logger from './logger'

import config from './config'
import commands from './commands'
import { healthCheck } from './health'
import startOsuBot from './osu'

const logger = new Logger('Discord')

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
})

const startBot = async () => {
  await client.login(config.discord.apiKey)
  logger.info(`login success! ${client.user?.displayName || 'bot'}`)

  client.on('ready', async () => {
    if (client.application) {
      await client.application.commands.set(commands)
      logger.info('command registered!')
    }
  })

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      const currentCommand = commands.find(
        ({ name }) => name === interaction.commandName
      )

      if (currentCommand) {
        await interaction.deferReply()
        currentCommand.execute(client, interaction)
        logger.info(`command ${currentCommand.name} handled.`)
      }
    }
  })
}

healthCheck.listen(8080)
startBot()
startOsuBot()
