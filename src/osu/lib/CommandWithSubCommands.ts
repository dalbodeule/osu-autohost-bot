import Command from './Command'
import SubCommand from './SubCommand'

export default abstract class CommandWithSubCommand extends Command {
  protected subCommands: Map<string, SubCommand> = new Map<string, SubCommand>()
}
