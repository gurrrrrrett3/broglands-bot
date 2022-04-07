import StateManager from "../auth/stateManager";

export default class WebUtil {
  public static buildDiscordAuthURL(clientID: string, redirectURI: string, scope: string) {
    const state = StateManager.genSatate();
    return `https://discordapp.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scope}&state=${state}`;
  }
}
