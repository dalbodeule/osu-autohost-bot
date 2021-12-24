import config from '../../config'
import Command from '../lib/Command'

import ping from './ping'
import beatmap from './beatmap'
import NewRoom from './newroom'
import Invite from './invite'
import Exit from './exit'
import CloseID from './closeID'
import Close from './close'
import Mode from './mode_command'

const commandList: Command[] = [
  new ping(),
  new beatmap(),
  new NewRoom(),
  new Invite(),
  new Exit(),
  new CloseID(),
  new Close(),
  new Mode(),
]

const formattedCommandList: Map<string, Command> = new Map()

commandList.forEach((value) => {
  formattedCommandList.set(
    `${config.commandPrefix}${value.name.toLowerCase()}`,
    value
  )
})

export default formattedCommandList
