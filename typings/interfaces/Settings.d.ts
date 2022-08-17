import { Message } from 'discord.js'

type FilterFunction = (msg?: Message) => boolean

export interface SettingsTypes {
    xp: number | [number, number]
    maxXP: number
    multiplier: number
    status: boolean
    ignoredUsers: string[],
    lockedChannels: string[]
    ignoreBots: boolean,
    filter: string | Function | FilterFunction
}

export interface SettingsArrays {
    ignoredUsers: string[],
    lockedChannels: string[]
}