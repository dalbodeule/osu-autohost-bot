import * as log4js from 'log4js'

class Logger {
  private logger: log4js.Logger
  private process: string

  constructor(processName = 'Main') {
    this.logger = log4js.getLogger(processName)
    this.process = processName

    if (process.env.NODE_ENV == 'production') {
      this.logger.level = 'INFO'
    } else {
      this.logger.level = 'DEBUG'
    }
  }

  public info(message: unknown): void {
    this.logger.info(message)
  }

  public debug(message: unknown): void {
    this.logger.debug(message)
  }

  public warn(message: unknown): void {
    this.logger.warn(message)
  }

  public fatal(message: unknown): void {
    this.logger.fatal(message)
  }
}

export default Logger
