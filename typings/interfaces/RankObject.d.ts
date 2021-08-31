export interface RankObject {

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