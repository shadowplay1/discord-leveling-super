/**
 * The user data that is stored in database.
 * Use it in case if the requested user
 * is not on your server.
 */
interface UserData {

    /**
     * User's ID.
     */
    id: string,

    /**
     * User's username.
     */
    username: string,

    /**
     * User's tag.
     */
    tag: string,

    /**
     * User's discriminator.
     */
    discriminator: string
}

export = UserData