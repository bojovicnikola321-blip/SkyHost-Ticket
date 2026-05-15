import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const muteCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout (mute) a user")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("minutes")
        .setDescription("Mute duration in minutes (max 40320 = 28 days)")
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("reason").setDescription("Reason for mute").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const app = interaction.applicationId;
    const target = interaction.options.getMember("user");
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") ?? t(app, "no_reason");

    if (!target || typeof target !== "object" || !("timeout" in target)) {
      await interaction.reply({ content: t(app, "mute_not_found"), flags: 64 });
      return;
    }

    const member = target as {
      timeout: (ms: number, reason: string) => Promise<void>;
      user: { tag: string };
      permissions: { has: (perm: bigint) => boolean };
    };

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: t(app, "mute_is_admin"), flags: 64 });
      return;
    }

    await member.timeout(minutes * 60 * 1000, reason);

    await interaction.reply({
      content: t(app, "mute_success", {
        user: member.user.tag,
        duration: String(minutes),
        reason,
      }),
    });
  },
};
