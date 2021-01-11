import config from '../../config'
import Command from '../lib/Command'

import ping from './ping'
import beatmap from './beatmap'

const commandList: Command[] = [new ping(), new beatmap()]

const formattedCommandList: Map<string, Command> = new Map()

commandList.forEach((value) => {
  formattedCommandList.set(
    `${config.commandPrefix}${value.name.toLowerCase()}`,
    value
  )
})

export default formattedCommandList
