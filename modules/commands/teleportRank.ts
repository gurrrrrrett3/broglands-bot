import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import Discord from "discord.js";
import Util from "../bot/util";
import TeleportRankViewer from "../bot/viewers/trankViewer";
import PlayerTeleportManager from "../data/player/playerTeleportManager";
import TeleportRanking from "../data/player/teleportRanking";
import { TeleportRank } from "../data/player/types";
import UUIDManager from "../data/player/uuidManager";
import MapInterface from "../map/mapInterface";
import { Coords } from "../resources/types";

const Command = {
  data: new SlashCommandBuilder()
    .setName("trank")
    .setDescription("Teleport Rank | View and edit teleport rankings")
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("leaderboard")
        .setDescription("Get info on leaderboards.")
        .addSubcommand(
          new SlashCommandSubcommandBuilder().setName("uses").setDescription("Sort by number of uses")
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("unique")
            .setDescription("Sort by number of unique users")
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("ratio")
            .setDescription("Sort by average number of uses per user")
        )
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("view")
        .setDescription("View data relating to teleport popularity.")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("coords")
            .setDescription("Select teleport rank by coords")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("world")
                .setDescription("The world the teleport rank is in.")
                .setRequired(true)
                .setChoices([
                  ["Overworld", "world"],
                  ["Earth", "earth"],
                  ["Nether", "world_nether"],
                  ["The End", "world_the_end"],
                  ["Hotels", "hotels"],
                  ["Parkour", "parkour"],
                  ["Extras", "extras"],
                ])
            )
            .addStringOption(
              new SlashCommandStringOption()
                .setName("x")
                .setDescription("The X coordnate of the teleport rank | Max: 21500, Min: -21500")
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption()
                .setName("z")
                .setDescription("The Z coordnate of the teleport rank | Max: 21500, Min: -21500")
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("name")
            .setDescription("Select teleport rank by name")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription("The name of the teleport rank, not case sensitive")
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("time")
            .setDescription("Get teleport rank data from a time period using TimeSearch")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription("The name of the teleport rank, not case sensitive")
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption()
                .setName("time")
                .setDescription(
                  "The time period to search for. | Example: '1d' for 1 day, '1w' for 1 week... etc"
                )
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName("edit")
        .setDescription("Edit names, descriptions, and tags of teleport rankings")
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("name")
            .setDescription("Change the name of a teleport rank.")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription(
                  "Current name of the teleport rank, if you don't know it yet use /trank view coords [x] [z]"
                )
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption().setName("new").setDescription("New name").setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("description")
            .setDescription("Change the description of a teleport rank.")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription(
                  "Name of the teleport rank, if you don't know it yet, use /trank view coords [x] [z]"
                )
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption()
                .setName("new")
                .setDescription("New Description")
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("tags")
            .setDescription("Change the tags of a teleport rank.")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription(
                  "Name of the teleport rank, if you don't know it yet use /trank view coords [x] [z]"
                )
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption()
                .setName("new")
                .setDescription('New tags, seperated by a comma ","')
                .setRequired(true)
            )
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName("owner")
            .setDescription("Change the owner of a teleport rank.")
            .addStringOption(
              new SlashCommandStringOption()
                .setName("name")
                .setDescription(
                  "Name of the teleport rank, if you don't know it yet, use /trank view coords [x] [z]"
                )
                .setRequired(true)
            )
            .addStringOption(
              new SlashCommandStringOption().setName("new").setDescription("New Owner").setRequired(true)
            )
        )
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    const options = interaction.options;

    const group = options.getSubcommandGroup();
    const subcommand = options.getSubcommand();

    const world = options.getString("world");
    const x = parseInt(options.getString("x") || "0");
    const z = parseInt(options.getString("z") || "0");
    const name = options.getString("name");
    const newValue = options.getString("new");
    const time = options.getString("time");

    await interaction.deferReply();

    if (group === "leaderboard") {
      interaction.editReply(TeleportRankViewer.displayOnCommandInteraction(interaction, subcommand));
    } else if (group === "view") {
      if (subcommand === "coords") {
        const data = TeleportRanking.getTeleportDataByCoords(x, z, world ?? "world");
        if (!data) {
          interaction.editReply("No teleport rank with those coordinates exists.");
          return;
        }

        interaction.editReply({ embeds: [genEmbed(data)] });
      } else if (subcommand === "name") {
        const data = TeleportRanking.getTeleportDataByName(name ?? "");
        if (!data) {
          interaction.editReply("No teleport rank with that name exists.");
          return;
        }

        interaction.editReply({ embeds: [genEmbed(data)] });
      } else if (subcommand === "time") {
       await interaction.editReply("This will take a while, please wait...");

        const data = getRelTrankData(name, time);
        if (!data) {
          interaction.editReply("Either the name or time period is invalid.");
          return;
        }

        const embed = new Discord.MessageEmbed()
          .setTitle(`${data.name}'s teleport rank in the last ${data.time?.f}`)
          .setDescription(
            [
              `${data.players.length} players have teleported to ${data.name} in the last ${data.time?.f}`,
              `**${data.count}** times in total.`,
              `The top ${data.players.length} players are shown.\n`,
              data.players.map((p, i) => `**${i + 1}** ${Util.formatPlayer(p.userame)} [\`${p.count}\`]`).join("\n"),
            ].join("\n")
          );

        interaction.editReply({ embeds: [embed], content: null });
      }
    } else if (group === "edit") {
      if (subcommand === "name") {
        const d = TeleportRanking.editTeleportData(name ?? "", {
          name: newValue ?? "",
          editedBy: interaction.user.username,
        });
        interaction.editReply(d);
      } else if (subcommand === "description") {
        const d = TeleportRanking.editTeleportData(name ?? "", {
          description: newValue ?? "",
          editedBy: interaction.user.username,
        });
        interaction.editReply(d);
      } else if (subcommand === "tags") {
        const d = TeleportRanking.editTeleportData(name ?? "", {
          tags: newValue?.split(",").map((v) => v.trim()),
          editedBy: interaction.user.username,
        });
        interaction.editReply(d);
      } else if (subcommand === "owner") {
        const d = TeleportRanking.editTeleportData(name ?? "", {
          owner: newValue ?? "",
          editedBy: interaction.user.username,
        });
        interaction.editReply(d);
      }
    }
  },
};
module.exports = Command;

function genEmbed(data: TeleportRank) {
  const embed = new Discord.MessageEmbed()
    .setTitle(`Teleport Rank - ${data.name}`)
    .setDescription(data.description ?? "No description set.")
    .addField("Uses", data.count.toString(), true)
    .addField("Unique Users", data.players.length.toString(), true)
    .addField("Ratio", (data.count / data.players.length).toString(), true)
    .addField("Tags", data.tags ? data.tags.join(", ") : "No tags set.", true)
    .addField("Owner", data.owner ?? "No owner set.", true)
    .addField("Coordinates", `${data.world} [${data.x}, ${data.z}]`, true)
    .addField(
      "Last Used",
      `${Util.formatDiscordTime(data.lastUsed, "longDateTime")} (${Util.formatDiscordTime(
        data.lastUsed,
        "relative"
      )})`
    )
    .addField(
      "First Used",
      data.firstUsed
        ? `${Util.formatDiscordTime(data.firstUsed, "longDateTime")} (${Util.formatDiscordTime(
            data.firstUsed,
            "relative"
          )})`
        : "No Data"
    )
    .addField(
      "Last 10 Users",
      data.players
        .slice(0, 10)
        .map(
          (u) =>
            `${Util.formatPlayer(
              UUIDManager.getUsername(u) ?? ""
            )} [\`${PlayerTeleportManager.getPlayerEndTeleportCount(u, {
              world: data.world,
              x: data.x,
              z: data.z,
            })}\`]`
        )
        .join("\n"),
      true
    )
    .addField(
      "Top 10 Users",
      data.players
        .sort((a, b) => {
          return (
            PlayerTeleportManager.getPlayerEndTeleportCount(b, {
              world: data.world,
              x: data.x,
              z: data.z,
            }) -
            PlayerTeleportManager.getPlayerEndTeleportCount(a, {
              world: data.world,
              x: data.x,
              z: data.z,
            })
          );
        })
        .slice(0, 10)
        .map(
          (u) =>
            `${Util.formatPlayer(
              UUIDManager.getUsername(u) ?? ""
            )} [\`${PlayerTeleportManager.getPlayerEndTeleportCount(u, {
              world: data.world,
              x: data.x,
              z: data.z,
            })}\`]`
        )
        .join("\n"),
      true
    )

    .setURL(
      MapInterface.generateMapLink(
        {
          world: data.world,
          x: data.x,
          z: data.z,
        },
        5
      )
    )

    .setColor("#0099ff")
    .setFooter({
      text: `Last edited by ${data.editedBy ?? "BrogBot"}`,
    });

  return embed;
}

function genLb(data: TeleportRank[], type: "unique" | "uses" | "ratio") {
  let output: string[] = [];
  data.forEach((rank, index) => {
    output.push(
      `${index + 1}. **${rank.name}** - ${
        type == "uses" || type == "unique" ? rank.count : (rank.count / rank.players.length).toFixed(2)
      } | ${rank.world} [${rank.x}, ${rank.z}]`
    );
  });

  let des = "";

  const embed = new Discord.MessageEmbed()
    .setTitle("Teleport Rank Leaderboard")
    .setColor("#0099ff")
    .setDescription(des + "\n" + output.join("\n"))
    .setFooter({
      text: "Use /trank view [name] to view a teleport rank.",
    });

  return embed;
}

function getRelTrankData(name: string | null, timeSearch: string | null) {
  if (!name || !timeSearch) return null;

  let time = Util.timeSearch(timeSearch);
  let after = Date.now() - (time?.d || 0);
  if (!after) {
    return;
  }

  // Get the data

  let trank = TeleportRanking.getTeleportDataByName(name);
  if (!trank) return;

  let coords: Coords = {
    x: trank.x,
    z: trank.z,
  };

  let uuids = UUIDManager.openFile();

  let count: {
    userame: string;
    count: number;
  }[] = [];

  let totalCount = 0;

  uuids.forEach(async (uuid) => {
    let data = PlayerTeleportManager.getPlayerTeleports({
      uuid: uuid.UUID,
      amount: -1,
      after: after,
    });

    data.forEach(async (d) => {
      if (d.end.world != trank?.world) return;
      let dis = Util.getDistance(coords, d.end);
      if (dis < 5) {
        totalCount++;
        let p = count.find((c) => c.userame == uuid.username);
        if (p) {
          p.count++;
        } else {
          count.push({
            userame: uuid.username,
            count: 1,
          });
        }
      }
    });
  });

  let outPlayers = count.sort((a, b) => b.count - a.count).slice(0, 25);

  return {
    name: trank.name,
    count: totalCount,
    players: outPlayers,
    world: trank.world,
    x: trank.x,
    z: trank.z,
    time,
  };
}
