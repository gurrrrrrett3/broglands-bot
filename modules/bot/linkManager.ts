import { Client, CommandInteraction, Interaction, MessageEmbed } from "discord.js";
import MapInterface from "../map/mapInterface";
import Blocks, { Block } from "../resources/block";
import Linking from "./linking";
export default class LinkManager {
  public codes: {
    interaction: CommandInteraction;
    id: string;
    ign: string;
    block: {
      x: number;
      z: number;
      block: string;
    };
    check: NodeJS.Timer;
    expire: NodeJS.Timeout;
  }[];

  constructor(private client: Client) {
    this.codes = [];
  }

  public newLink(interaction: CommandInteraction, ign: string) {
    const id = interaction.user.id;
    const block = Blocks.pick();

    this.codes.push({
        interaction,
      id,
      ign,
      block,
      check: this.getCheck(ign, block, interaction),
      expire: this.getExpire(id),
    });

    const embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Almost there!")
        .setDescription(`Go to \`/nation spawn\` on the server and stand on the ${block.block}`)
        
    interaction.reply({embeds: [embed]})
  }

  private triggerLink(ign: string, interaction: CommandInteraction) {

   const link = this.codes.find((code) => code.ign === ign)
    if (!link) return

    const user = this.client.users.cache.get(link.id)
    if (!user) return

    const embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Linked!")
        .setDescription(`Your discord account (${user.tag}) has been linked to your Minecraft account (${ign})`)

    user.send({embeds: [embed]}).catch(() => {
        link.interaction.channel?.send({embeds: [embed]})
    })

    Linking.newLink(link.id, ign)
    clearInterval(link.check)
    clearTimeout(link.expire)
    this.codes = this.codes.filter((code) => code.id !== link.id)
    const member = interaction.guild?.members.cache.get(link.id)
    member?.setNickname(ign).catch(() => {
        interaction.reply(`Failed to set nickname for ${ign}`)
    })
    member?.roles.add(interaction.guild?.roles.cache.find((r) => r.name === "Linked")!).catch(() => {
        interaction.reply(`Failed to add role for ${ign}`)
    })
  }

  private getCheck(ign: string, block: Block, interaction: CommandInteraction): NodeJS.Timer {
    //checks every 5 seconds
    return setInterval(async () => {
      MapInterface.getPlayers().then((players) => {
        const player = players.find((p) => p.name === ign);
        if (player) {
          const coords = player.getLocation();
          if (coords.x === block.x && coords.z === block.z) {
            this.triggerLink(ign, interaction);
          }
        }
      });
    }, 5000);
  }

  private getExpire(id: string): NodeJS.Timeout {
    //expires in 5 minutes
    return setTimeout(() => {
      this.codes = this.codes.filter((code) => code.id !== id);
    }, 300000);
  }
}
