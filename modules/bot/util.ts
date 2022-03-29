import Discord from "discord.js";

export default class Util {
  public static async purgeChannel(channel: Discord.TextChannel, limit: number) {
    const messages = await channel.messages.fetch({ limit: limit });

    await channel.bulkDelete(messages);
  }
}
