import fs from 'fs';
import path from 'path'
import { DiscordToken } from './types';

const p = path.resolve("./data/tokens.json")

export default class TokenManager {

    public static storeToken(data: DiscordToken) {
        data.expires_in = Date.now() + (data.expires_in * 1000);
        const tokens = this.openFile();
        
        const index = tokens.findIndex(token => token.access_token === data.access_token);
        if (index > -1) {
            tokens[index] = data;
        } else {
            tokens.push(data);
        }

        this.saveFile(tokens);
    }


    private static openFile(): DiscordToken[] {
        return JSON.parse(fs.readFileSync(p, "utf8"));
    }

    private static saveFile(data: DiscordToken[]) {
        fs.writeFileSync(p, JSON.stringify(data));
    }
}