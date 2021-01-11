import config from '../../config'
import Command from '../lib/Command'

import ping from './ping'

const commandList: Command[] = [new ping()]

const formattedCommandList: Map<string, Command> = new Map()

commandList.forEach((value) => {
  formattedCommandList.set(
    `${config.commandPrefix}${value.name.toLowerCase()}`,
    value
  )
})

export default formattedCommandList
