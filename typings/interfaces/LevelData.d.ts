import UserData from './UserData'

export interface LevelData {

    /**
     * Guild ID.
     */
    guildID: string

    /**
     * User ID.
     */
    userID: string

    /**
     * The user data that is stored in database.
     * Use it in case if the requested user
     * is not on your server.
     */
    userData: UserData

    /**
     * User's amount of XP.
     */
    xp: number

    /**
     * User's total amount of XP.
     */
    totalXP: number

    /**
     * User's level.
     */
    level: number

    /**
    * How much XP in total the user need to reach the next level.
    */
    maxXP: number

    /**
    * The difference between max XP and current amount of XP. It shows how much XP he need to reach the next level.
    */
    difference: number
    
    /**
     * User's XP multiplier.
     */
    multiplier: number
}