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
    addXP: XPData
    subtractXP: LevelData

    setTotalXP: LevelData
    addTotalXP: XPData,
    subtractTotalXP: LevelData,
    
    ready: void,
    destroy: void
}