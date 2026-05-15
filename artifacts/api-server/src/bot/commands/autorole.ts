import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const autoRoleData: Map<string, string> = new Map();

export const autoroleCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Manage automatic role for new members")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Set auto role")
        .addRoleOption((opt) =>
          opt.setName("role").setDescription("Role to assign").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("off").setDescription("Disable auto role")
    )
    .addSubcommand((sub) =>
      sub.setName("info").setDescription("Show current auto role")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;
    const app = interaction.applicationId;

    if (sub === "set") {
      const role = interaction.options.getRole("role", true);
      autoRoleData.set(guildId, role.id);
      await interaction.reply({
        content: t(app, "autorole_set", { role: role.name }),
        flags: 64,
      });
    }

    if (sub === "off") {
      autoRoleData.delete(guildId);
      await interaction.reply({ content: t(app, "autorole_off"), flags: 64 });
    }

    if (sub === "info") {
      const roleId = autoRoleData.get(guildId);
      if (!roleId) {
        await interaction.reply({ content: t(app, "autorole_none"), flags: 64 });
      } else {
        await interaction.reply({
          content: t(app, "autorole_info", { role: `<@&${roleId}>` }),
          flags: 64,
        });
      }
    }
  },
};
