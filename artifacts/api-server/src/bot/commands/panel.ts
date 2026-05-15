import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";

export const panelCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Pošalji info/admin panel embed u trenutni kanal")
    .addStringOption((opt) =>
      opt
        .setName("naslov")
        .setDescription("Naslov panela")
        .setRequired(false)
    )
    .addStringOption((opt) =>
      opt
        .setName("opis")
        .setDescription("Opis panela")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString("naslov") ?? "🌐 SkyHost Panel";
    const desc =
      interaction.options.getString("opis") ??
      "Dobrodošli na **SkyHost** server!\nKoristite dugmad ispod za brzi pristup.";

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(0x00b4d8)
      .addFields(
        { name: "🎫 Support", value: "Otvori ticket za pomoć", inline: true },
        { name: "📋 Pravila", value: "Poštuj pravila servera", inline: true },
        { name: "📢 Novosti", value: "Prati announcements", inline: true }
      )
      .setFooter({ text: "SkyHost | Hosting Panel" })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("panel_rules")
        .setLabel("📋 Pravila")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("panel_support")
        .setLabel("🎫 Support")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel("🌐 Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://skyhost.ba")
    );

    await interaction.reply({
      content: "✅ Panel je poslan!",
      flags: 64,
    });

    await interaction.channel?.send({ embeds: [embed], components: [row] });
  },
};
