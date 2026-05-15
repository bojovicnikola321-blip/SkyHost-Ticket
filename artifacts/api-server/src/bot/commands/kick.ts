import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const kickCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("reason").setDescription("Reason for kick").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const app = interaction.applicationId;
    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") ?? t(app, "no_reason");

    if (!target || typeof target !== "object" || !("kick" in target)) {
      await interaction.reply({ content: t(app, "kick_not_found"), flags: 64 });
      return;
    }

    const member = target as {
      kick: (reason: string) => Promise<void>;
      user: { tag: string };
      permissions: { has: (perm: bigint) => boolean };
    };

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: t(app, "kick_is_admin"), flags: 64 });
      return;
    }

    await member.kick(reason);

    await interaction.reply({
      content: t(app, "kick_success", { user: member.user.tag, reason }),
    });
  },
};
