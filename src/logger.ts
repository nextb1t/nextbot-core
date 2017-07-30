export enum LogLevel { err = 0, warn = 1, info = 2 }

export class Logger {
  private curpre

  constructor(private readonly pre: string = '',
    private readonly level = LogLevel[process.env.LOGLEVEL || 'info']) {
    this.curpre = pre
  }
 
  public err(str)  { return this.at(LogLevel.err,  str) }
  public warn(str) { return this.at(LogLevel.warn, str) }
  public info(str) { return this.at(LogLevel.info, str) }

  public ln() {
    process.stdout.write('\n')
    this.curpre = this.pre    
  }

  private at(level: LogLevel, str: string) {
    if (this.level >= level) {
      process.stdout.write(this.curpre + str)
      this.curpre = ''
    }
    return this
  }
}

export let log = new Logger()

export default log