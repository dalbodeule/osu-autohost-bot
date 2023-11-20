import { ApplicationCommandOptionType } from 'discord.js'
import { SlashCommand } from '../types/slashCommand'

export const ping: SlashCommand = {
  name: 'ping',
  description: 'Ping from discord bots.',
  options: [
    {
      required: true,
      name: 'contents',
      description: 'reply with contents',
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const echoMessage = interaction.options.get('contents')?.value || ''
    await interaction.followUp({
      ephemeral: true,
      content: `${interaction.user.username.toString()} ${echoMessage}`,
    })
  },
}
