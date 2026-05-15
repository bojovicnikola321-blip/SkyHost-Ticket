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
import { t } from "../i18n";

export const panelCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Send an info/admin panel embed to the current channel")
    .addStringOption((opt) =>
      opt.setName("title").setDescription("Panel title").setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName("description").setDescription("Panel description").setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const app = interaction.applicationId;
    const title = interaction.options.getString("title") ?? t(app, "panel_title");
    const desc = interaction.options.getString("description") ?? undefined;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc ?? `Welcome!\nUse the buttons below for quick access.`)
      .setColor(0x00b4d8)
      .addFields(
        { name: t(app, "panel_field_support"), value: t(app, "panel_field_support_val"), inline: true },
        { name: t(app, "panel_field_rules"),   value: t(app, "panel_field_rules_val"),   inline: true },
        { name: t(app, "panel_field_news"),    value: t(app, "panel_field_news_val"),    inline: true }
      )
      .setFooter({ text: t(app, "panel_footer") })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("panel_rules")
        .setLabel(t(app, "panel_btn_rules"))
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("panel_support")
        .setLabel(t(app, "panel_btn_support"))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setLabel(t(app, "panel_btn_website"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://skyhost.ba")
    );

    await interaction.reply({ content: t(app, "panel_sent"), flags: 64 });
    await interaction.channel?.send({ embeds: [embed], components: [row] });
  },
};
