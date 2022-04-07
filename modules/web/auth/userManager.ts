import fs from "fs";
import path from "path"
import User from "../resources/user";
import auth from "../../../auth.json";
import TokenManager from "./tokenManager";
import fetch from "node-fetch";

const p = path.resolve("./data/users/")

export default class UserManager {
  static authUser(code: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const data = {
        client_id: auth.CLIENT_ID,
        client_secret: auth.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: auth.REDIRECT_URI,
      };

      fetch(`https://discordapp.com/api/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.access_token) {
            TokenManager.storeToken(json);
            fetch(`https://discordapp.com/api/users/@me`, {
              headers: {
                Authorization: `Bearer ${json.access_token}`,
              },
            })
              .then((res) => res.json())
              .then((json) => {
                let user = new User(json.id, json.username, json.avatar);
                UserManager.saveUser(user);
                resolve(user);
              })
              .catch((err) => reject(err));
          } else {
            reject(json);
          }
        });
    });
  }

  public static getUser(id: string): User | undefined {
    if (fs.existsSync(`${p}/${id}.json`)) {
      return JSON.parse(fs.readFileSync(`${p}/${id}.json`, "utf8"));
    } else {
      return undefined;
    }
  }

  public static saveUser(user: User): void {
    fs.writeFileSync(`${p}/${user.id}.json`, JSON.stringify(user));
  }
}