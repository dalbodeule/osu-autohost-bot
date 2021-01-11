import * as log4js from "log4js"

class Logger {
  private logger: log4js.Logger
  private process: string

  constructor(processName = 'Main') {
    this.logger = log4js.getLogger()
    this.process = processName

    if (process.env.NODE_ENV == "production") {
      this.logger.level = "INFO"
    } else {
      this.logger.level = "DEBUG"
    }
  }

  public info(message: string): void {
    this.logger.info(`${this.process}: ${message}`)
  }

  public debug(message: string): void {
    this.logger.debug(`${this.process}: ${message}`)
  }

  public warn(message:string): void {
    this.logger.warn(`${this.process}: ${message}`)
  }

  public fatal(message:string): void {
    this.logger.fatal(`${this.process}: ${message}`)
  }
}

export default Logger