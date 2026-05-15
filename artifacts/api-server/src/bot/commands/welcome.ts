import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const welcomeData: Map<string, { channelId: string; message: string }> = new Map();

export const welcomeCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Postavi welcome kanal i poruku")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Postavi welcome kanal")
        .addChannelOption((opt) =>
          opt
            .setName("kanal")
            .setDescription("Welcome kanal")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("poruka")
            .setDescription(
              "Welcome poruka. Koristi {user} za mention i {server} za ime servera."
            )
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("off").setDescription("Isključi welcome poruke")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;

    if (sub === "set") {
      const channel = interaction.options.getChannel("kanal", true);
      const message =
        interaction.options.getString("poruka") ??
        "👋 Dobrodošao/la {user} na **{server}**! Nadam se da ćeš uživati!";

      welcomeData.set(guildId, { channelId: channel.id, message });

      await interaction.reply({
        content: `✅ Welcome kanal postavljen na ${channel}!\nPoruka: \`${message}\``,
        flags: 64,
      });
    }

    if (sub === "off") {
      welcomeData.delete(guildId);
      await interaction.reply({
        content: "✅ Welcome poruke su isključene.",
        flags: 64,
      });
    }
  },
};
