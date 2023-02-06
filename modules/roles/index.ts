import { bot } from "../../core";
import Module from "../../core/base/module";
import RolePicker from "./rolePicker";
import roleConfig from "../../config/roles.json";
import Logger from "../../core/utils/logger";
import { GuildMember, GuildMemberRoleManager, StringSelectMenuInteraction } from "discord.js";

export default class RolesModule extends Module {
  name = "roles";
  description = "manages roles";

  getRolesModule(): RolesModule {
    return bot.moduleLoader.getModule("roles") as RolesModule;
  }

  override async onLoad(): Promise<boolean> {
    const picker = new RolePicker(roleConfig);

    bot.buttonManager.registerButton("role-menu", async (interaction) => {
      picker.createPickerMenu(interaction);
    });

    bot.selectMenuManager.registerMenu(
      "role-picker",
      async (menuInteraction: StringSelectMenuInteraction) => {
        const selected = menuInteraction.values;
        const member = menuInteraction.member;
        if (!member) return;
        const roles = member.roles;
        if (!roles || !(roles instanceof GuildMemberRoleManager)) return;

        const promises: Promise<GuildMember>[] = [];

        picker.roles.forEach(async (role) => {
          if (selected.includes(role.id)) {
            if (!roles.cache.has(role.id)) {
              promises.push(roles.add(role.id));
            }
          } else {
            if (roles.cache.has(role.id)) {
              promises.push(roles.remove(role.id));
            }
          }
        });

        await menuInteraction.update({
          content: "Updating roles...",
        });

        await Promise.all(promises).catch((err) => Logger.error("rolePicker", err));

        await menuInteraction
          .editReply({
            content: "Roles updated!",
            components: [picker.createMenu(menuInteraction, true)],
          })
          .catch((err) => Logger.error("rolePicker", err))
          .then(() => {
            setTimeout(async () => {
              await menuInteraction.deleteReply().catch((err) => Logger.error("rolePicker", err));
            }, 10000);
          });
      }
    );

    return true;
  }
}
