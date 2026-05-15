import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const muteCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout (mute) korisnika")
    .addUserOption((opt) =>
      opt.setName("korisnik").setDescription("Korisnik").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("minuta")
        .setDescription("Trajanje mute u minutama (max 40320 = 28 dana)")
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razlog").setDescription("Razlog mute").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("korisnik");
    const minutes = interaction.options.getInteger("minuta", true);
    const razlog =
      interaction.options.getString("razlog") ?? "Nije naveden razlog";

    if (!target || typeof target !== "object" || !("timeout" in target)) {
      await interaction.reply({ content: "❌ Korisnik nije pronađen.", flags: 64 });
      return;
    }

    const member = target as {
      timeout: (ms: number, reason: string) => Promise<void>;
      user: { tag: string };
      permissions: { has: (perm: bigint) => boolean };
    };

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({
        content: "❌ Ne mogu da mutiram admina.",
        flags: 64,
      });
      return;
    }

    const ms = minutes * 60 * 1000;
    await member.timeout(ms, razlog);

    await interaction.reply({
      content: `🔇 **${member.user.tag}** je mutiran na **${minutes} min**.\n📋 Razlog: ${razlog}`,
    });
  },
};
