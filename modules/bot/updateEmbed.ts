import Discord from "discord.js";
import MapInterface from "../map/mapInterface";
import Town from "../resources/town";

export default class UpdateEmbed {

    public static readonly townInfoChannelId = "953652115094519898";
    public static readonly nationInfoChannelId = "958108424913174528";

    public townInfoChannel: Discord.TextChannel;
    public nationInfoChannel: Discord.TextChannel;

    constructor (public client: Discord.Client) {

        this.townInfoChannel = this.client.channels.cache.get(UpdateEmbed.townInfoChannelId) as Discord.TextChannel;
        this.nationInfoChannel = this.client.channels.cache.get(UpdateEmbed.nationInfoChannelId) as Discord.TextChannel;

    }

    public newTown(town: Town): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle("New Town")
            .setDescription(`${town.name} has been founded by ${town.mayor}`)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\`\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});

    }

    public updateTown(town: Town, title: string, desc: string): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#ffff00")
            .setTitle(title)
            .setDescription(desc)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\`\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});
    }

    public removeTown(town: Town): void {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Town Removed")
            .setDescription(`${town.name} has been removed`)
            .addField("Location", `x: \`${town.coords.x}\`\nz: \`${town.coords.z}\`\nWorld: \`${town.world}\`\n[View on map](${MapInterface.generateMapLink(town.getLocation(), 3)})`, true)
            .setTimestamp();

        this.townInfoChannel.send({embeds: [embed]});
    }

}