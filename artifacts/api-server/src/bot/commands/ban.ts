import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const banCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban korisnika sa servera")
    .addUserOption((opt) =>
      opt.setName("korisnik").setDescription("Korisnik").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("razlog").setDescription("Razlog bana").setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("brisanje_poruka")
        .setDescription("Briši poruke (dani, 0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("korisnik", true);
    const razlog =
      interaction.options.getString("razlog") ?? "Nije naveden razlog";
    const deleteMessageDays =
      interaction.options.getInteger("brisanje_poruka") ?? 0;

    const member = interaction.guild?.members.cache.get(user.id);

    if (member) {
      if (
        member.permissions.has(PermissionFlagsBits.Administrator)
      ) {
        await interaction.reply({
          content: "❌ Ne mogu da banujem admina.",
          flags: 64,
        });
        return;
      }
    }

    await interaction.guild?.members.ban(user.id, {
      reason: razlog,
      deleteMessageSeconds: deleteMessageDays * 86400,
    });

    await interaction.reply({
      content: `🔨 **${user.tag}** je banovan!\n📋 Razlog: ${razlog}`,
    });
  },
};
