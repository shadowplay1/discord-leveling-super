import { LevelUpData } from './LevelUpData'
import { LevelData } from './LevelData'
import { XPData } from './XPData'

import Leveling from '../../src'

/**
 * Leveling events list.
 */
declare interface LevelingEvents {
    levelUp: LevelUpData

    setLevel: LevelData
    addLevel: XPData
    subtractLevel: LevelData

    setXP: LevelData
    addXP: XPData & {

        /**
         * How much XP the user gained after sending a message
         */
        gainedXP: number
    }

    subtractXP: LevelData

    setTotalXP: LevelData
    addTotalXP: XPData & {

        /**
         * How much XP the user gained after sending a message
         */
        gainedXP: number
    },

    subtractTotalXP: LevelData,

    ready: void,
    destroy: void
}