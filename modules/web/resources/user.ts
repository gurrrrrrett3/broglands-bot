import Linking from "../../bot/linking";
export default class User {

    public id: string;
    public username: string;
    public avatar: string;
    public ign: string | undefined

    constructor(id: string, username: string, avatar: string) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.ign = Linking.getLinkByID(id)?.ign
    }

}