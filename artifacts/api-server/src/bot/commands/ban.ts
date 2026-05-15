import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const banCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("reason").setDescription("Reason for ban").setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("delete_messages")
        .setDescription("Delete messages (days, 0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const app = interaction.applicationId;
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? t(app, "no_reason");
    const deleteMessageDays = interaction.options.getInteger("delete_messages") ?? 0;

    const member = interaction.guild?.members.cache.get(user.id);
    if (member?.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: t(app, "ban_is_admin"), flags: 64 });
      return;
    }

    await interaction.guild?.members.ban(user.id, {
      reason,
      deleteMessageSeconds: deleteMessageDays * 86400,
    });

    await interaction.reply({
      content: t(app, "ban_success", { user: user.tag, reason }),
    });
  },
};
