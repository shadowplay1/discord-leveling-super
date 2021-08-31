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
    userData: UserData
}