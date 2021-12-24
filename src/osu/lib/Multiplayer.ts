import {
  BanchoChannel,
  BanchoClient,
  BanchoLobby,
  BanchoMod,
  BanchoMultiplayerChannel,
  BanchoUser,
} from 'bancho.js'
import nodesu, { Beatmap, ModeType } from 'nodesu'
import { client, logger } from '..'
import config from '../../config'
import formattedCommandList from '../command'
import * as ENUM from '../lib/enum'
import { CommandExecutorRole, CommandWhereExecutied } from './Command'

export default class Multiplayer {
  private multiplayerChannel: BanchoMultiplayerChannel
  private lobby: BanchoLobby
  private client: BanchoClient

  private channel: BanchoMultiplayerChannel | BanchoChannel

  private queue: nodesu.Beatmap[] = []

  public isPassword: boolean
  public isPlay: boolean
  public beatmap: nodesu.Beatmap | undefined
  public name: string
  public player: number
  public maxPlayer: number
  public roomOwner: BanchoUser
  public id: number
  public mods: BanchoMod[]
  public mode: ENUM.Mode
  public password?: string
  public master?: BanchoUser
  public keys: number

  constructor(
    client: BanchoClient,
    multiplayerChannel: BanchoMultiplayerChannel,
    roomOwner: BanchoUser,
    password?: string
  ) {
    this.multiplayerChannel = multiplayerChannel
    this.lobby = multiplayerChannel.lobby
    this.client = client
    this.master = undefined

    void this.multiplayerChannel.join()

    this.channel = client.getChannel(`#mp_${this.lobby.id}`)
    void this.channel.join()

    this.isPlay = false
    this.beatmap = undefined
    this.name = this.lobby.name
    this.id = this.lobby.id

    this.player = 0
    this.maxPlayer = this.lobby.size

    this.roomOwner = roomOwner

    this.mods = []
    this.mode = ENUM.Mode.OSU
    this.keys = 7

    if (password) {
      void this.setPassword(password)
      this.isPassword = true
    } else {
      this.isPassword = false
      void this.setPassword()
    }

    // password status
    this.lobby.on('passwordChanged', () => (this.isPassword = true))
    this.lobby.on('passwordRemoved', () => (this.isPassword = false))

    const matchFinished = () => {
      this.isPlay = false

      this.queue.splice(0, 1)
      void this.setBeatmap(this.queue[0], this.mode)
    }

    // play status
    this.lobby.on('matchStarted', () => (this.isPlay = true))
    this.lobby.on('matchFinished', matchFinished)
    this.lobby.on('matchAborted', matchFinished)

    // song status
    this.lobby.on('beatmap', (beatmap) => {
      this.beatmap = beatmap
      this.mode = beatmap.mode || ENUM.Mode.OSU
    })
    this.lobby.on('invalidBeatmapId', () => (this.beatmap = undefined))
    this.lobby.on('mods', (mods) => {
      this.mods = mods
    })

    // name status
    this.lobby.on('name', (name) => (this.name = name))

    // user status
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.lobby.on('playerJoined', async (obj) => {
      playerToMultiLobby.set(obj.player.user.id, this)
      this.player++

      if (obj.player.user == this.roomOwner) {
        await this.lobby.addRef(obj.player.user.ircUsername)
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.lobby.on('playerLeft', async (obj) => {
      if (this.master?.id == obj.user.id) {
        if (this.multiplayerChannel.channelMembers.length > 0) {
          this.setMaster = this.multiplayerChannel.channelMembers[0].user
        } else {
          this.master = undefined
        }
      }

      playerToMultiLobby.delete(obj.user.id)
      this.player--

      if (this.player == 0) {
        await this.close()
      }
    })

    // lobby status
    this.multiplayerChannel.on('PART', (member) => {
      if (member.user == client.getSelf()) {
        multiplayerList.delete(this.id)

        logger.info(`room closed ${this.name}`)
      }
    })

    // lobby chat
    this.multiplayerChannel.on('message', (msg) => {
      const splittedMsg = msg.message.split(' ')

      if (
        msg.message.startsWith(config.commandPrefix) &&
        formattedCommandList.get(splittedMsg[0].toLowerCase())
      ) {
        void formattedCommandList
          .get(splittedMsg[0].toLowerCase())
          ?.commandHandler(
            msg.user,
            splittedMsg,
            CommandWhereExecutied.ROOM,
            CommandExecutorRole.NORMAL,
            this
          )
      }
    })

    multiplayerList.set(this.id, this)
  }

  public async setPassword(pw?: string): Promise<void> {
    this.password = pw
    await this.lobby.setPassword(pw || '')
  }

  public async invite(user: BanchoUser): Promise<void> {
    await this.lobby.invitePlayer(`#${user.id}`)
  }

  public async close(): Promise<void> {
    await this.sendMessage('!mp close')
  }

  public async setBeatmap(map: Beatmap, mode?: number): Promise<void> {
    await this.sendMessage(`!mp map ${map.id} ${mode || ENUM.Mode.OSU}`)
  }

  public async sendMessage(msg: string): Promise<void> {
    await this.channel.sendMessage(msg)
    logger.info(`SEND ${this.channel.name} - ${msg}`)
  }

  public addMap(map: Beatmap): boolean {
    this.queue.push(map)

    if (this.queue.length == 1) {
      void this.setBeatmap(map, this.mode)
    }

    return true
  }

  public removeMap(map: Beatmap): boolean {
    this.queue.splice(this.queue.indexOf(map), 1)

    return true
  }

  public get Map(): Beatmap[] {
    return this.queue
  }

  public clearMap(): boolean {
    this.queue = []

    return true
  }

  public set setMode(mode: ENUM.Mode) {
    this.mode = mode
    if (this.queue.length > 0) void this.setBeatmap(this.queue[0], mode)
  }

  public set setMaster(user: BanchoUser) {
    this.master = user
  }

  public set setKeys(key: number) {
    this.keys = Math.max(1, Math.min(9, Math.round(key)))
  }
}

const multiplayerList: Map<number, Multiplayer> = new Map()

const playerToMultiLobby: Map<number, Multiplayer> = new Map()

export { multiplayerList, playerToMultiLobby }
