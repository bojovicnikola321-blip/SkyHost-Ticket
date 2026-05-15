import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const kickCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickuj korisnika sa servera")
    .addUserOption((opt) =>
      opt.setName("korisnik").setDescription("Korisnik").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razlog").setDescription("Razlog kicka").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("korisnik");
    const razlog =
      interaction.options.getString("razlog") ?? "Nije naveden razlog";

    if (!target || typeof target !== "object" || !("kick" in target)) {
      await interaction.reply({ content: "❌ Korisnik nije pronađen.", flags: 64 });
      return;
    }

    const member = target as {
      kick: (reason: string) => Promise<void>;
      user: { tag: string };
      permissions: { has: (perm: bigint) => boolean };
    };

    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({
        content: "❌ Ne mogu da kickujem admina.",
        flags: 64,
      });
      return;
    }

    await member.kick(razlog);

    await interaction.reply({
      content: `👢 **${member.user.tag}** je kickovan!\n📋 Razlog: ${razlog}`,
    });
  },
};
