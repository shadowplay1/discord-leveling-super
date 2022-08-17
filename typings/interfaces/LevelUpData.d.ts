import {
    Channel, Message,
    AttachmentBuilder, EmbedBuilder, MessageOptions, User
} from 'discord.js'

declare interface LevelUpData {

    /**
     * Guild ID.
     */
    guildID: string

    /**
     * The user that reached a new level.
     */
    user: User

    /**
     * New level.
     */
    level: number

    /**
    * How much XP in total the user need to reach the next level.
    */
    maxXP: number

    /**
     * User's XP multiplier.
     */
    multiplier: number

    /**
     * A function that will send a specified message to a specified channel.
     * @param {String} msg Message string, embed, attachment or message options.
     * @param {String} channel Channel or it's ID.
     */
    sendMessage(msg: string | EmbedBuilder | AttachmentBuilder | MessageOptions, channel?: string | Channel): Promise<Message>
}