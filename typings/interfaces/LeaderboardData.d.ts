import { User } from 'discord.js';
import UserData from './UserData';

declare interface LeaderboardData {
    userID: String,
    level: Number,
    totalXP: Number,
    xp: Number,
    maxXP: Number,
    difference: Number,
    user: User,

    /**
    * The user data that is stored in database.
    * Use it in case if the requested user
    * is not on your server.
    */
    userData: UserData
}