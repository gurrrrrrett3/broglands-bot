import Discord from "discord.js";
import ytsr from "ytsr";
import { bot } from "../../..";
import MusicSearch from "../search";
import Track from "../track";
export default class SearchEmbed {
  constructor(public query: string) {}

  async get(page: number) {
    let yts: ytsr.ContinueResult | ytsr.Result = await MusicSearch.youtube(this.query);
    for (let i = 1; i < page; i++) {
      yts = await MusicSearch.continue(yts);
    }

    let items = yts.items.filter((item) => item.type == "video").splice(0, 25);

    let dis = items
      .map((item, idx) => {
        if (item.type != "video") return;
        return `\`${idx + 1}\` **${item.title}** | ${item.duration}`;
      })
      .join("\n");

    let options: Discord.MessageSelectOptionData[] = items.map((item, idx) => {
      if (item.type != "video")
        return {
          value: (idx + 1).toString(),
          label: "Error loading this content",
        };

      let label = `${idx + 1} ${item.title}`;

      if (label.length > 100) {
        label = label.substring(0, 96).concat("...");
      }

      return {
        value: (idx + 1).toString(),
        label: label,
        description: `${item.duration} | ${item.author?.name}`,
      };
    });

    return {
      embeds: [new Discord.MessageEmbed()
        .setTitle("Select a video!")
        .setDescription(dis)
        .setFooter({text: `Page ${page}, Showing ${items.length}/${yts.items.length} items`})
    ],
      components: [
        new Discord.MessageActionRow().addComponents([
          new Discord.MessageSelectMenu()
            .setCustomId(`search-${page}-${this.query}`)
            .addOptions(options)
            .setPlaceholder("Select a video!"),
        ]),
        new Discord.MessageActionRow().addComponents([
          new Discord.MessageButton()
          .setCustomId(`search-${page - 1}-${this.query}`)
          .setEmoji("◀️")
          .setDisabled(page == 1)
          .setStyle("SUCCESS"),
          new Discord.MessageButton()
          .setCustomId(`search-${page + 1}-${this.query}`)
          .setEmoji("▶️")
          .setStyle("SUCCESS"),
        ]),
      ],
    } 
  }


  public static async editOnButtonInteraction(interaction: Discord.ButtonInteraction, id: string) {
    const [search, page, ...querys] = id.split("-");
    const query = querys.join("-")

    const p = new SearchEmbed(query)
    interaction.update(await p.get(parseInt(page))).catch((reason) => {
        console.error(reason)
    })

  }

  public static async select(interaction: Discord.SelectMenuInteraction, id: string) {
    const [search, page, ...querys] = id.split("-");
    const query = querys.join("-")

    let member = interaction.member as Discord.GuildMember
    let vc = member.voice

    let yts: ytsr.ContinueResult | ytsr.Result = await MusicSearch.youtube(query);
    for (let i = 1; i < parseInt(page); i++) {
      yts = await MusicSearch.continue(yts);
    }

    let items = yts.items.filter((item) => item.type == "video").splice(0, 25);
    
    let selection = parseInt(interaction.customId)
    
    let selectedItem = items.at(selection - 1)

    if (!selectedItem || selectedItem.type != "video") return

    const gm = bot.music.getGuildMusicManager(vc.channel?.guildId ?? "", vc.channel as Discord.VoiceChannel)
    gm.enqueue(new Track(selectedItem.url))

    interaction.update({
        embeds: [
            new Discord.MessageEmbed()
            .setTitle("Now Playing")
            .setDescription(`Now playing **${selectedItem.title}**, by ${selectedItem.author?.name ?? "Unknown"}\n${selectedItem.description ?? ""}`)
            .setImage(selectedItem.bestThumbnail.url ?? "")
            .setFooter({text: `Selected by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({format: "png"}) ?? undefined })

        ],
        components: []
    })

  }

}
