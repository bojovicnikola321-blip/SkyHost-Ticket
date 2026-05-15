import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const autoRoleData: Map<string, string> = new Map();

export const autoroleCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Postavi automatsku rolu za nove članove")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Postavi auto rolu")
        .addRoleOption((opt) =>
          opt.setName("rola").setDescription("Rola koja se daje").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("off").setDescription("Isključi auto rolu")
    )
    .addSubcommand((sub) =>
      sub.setName("info").setDescription("Prikaži trenutnu auto rolu")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;

    if (sub === "set") {
      const role = interaction.options.getRole("rola", true);
      autoRoleData.set(guildId, role.id);

      await interaction.reply({
        content: `✅ Auto rola postavljena na **${role.name}**. Svaki novi član je automatski dobija.`,
        flags: 64,
      });
    }

    if (sub === "off") {
      autoRoleData.delete(guildId);
      await interaction.reply({
        content: "✅ Auto rola je isključena.",
        flags: 64,
      });
    }

    if (sub === "info") {
      const roleId = autoRoleData.get(guildId);
      if (!roleId) {
        await interaction.reply({
          content: "ℹ️ Auto rola nije postavljena. Koristi `/autorole set`.",
          flags: 64,
        });
      } else {
        await interaction.reply({
          content: `ℹ️ Trenutna auto rola: <@&${roleId}>`,
          flags: 64,
        });
      }
    }
  },
};
