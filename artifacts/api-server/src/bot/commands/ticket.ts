import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  type ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const ticketCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket system management")
    .addSubcommand((sub) =>
      sub
        .setName("setup")
        .setDescription("Set up ticket panel")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Channel to send the ticket panel to")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName("support_role")
            .setDescription("Role that can see tickets")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("close").setDescription("Close current ticket")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const app = interaction.applicationId;

    if (sub === "setup") {
      const channel = interaction.options.getChannel("channel", true);
      const role = interaction.options.getRole("support_role", true);

      const embed = new EmbedBuilder()
        .setTitle(t(app, "ticket_embed_title"))
        .setDescription(t(app, "ticket_embed_desc"))
        .setColor(0x5865f2)
        .setFooter({ text: t(app, "ticket_embed_footer") })
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`ticket_open:${role.id}`)
          .setLabel(t(app, "ticket_open_button"))
          .setStyle(ButtonStyle.Primary)
      );

      const textChannel = await interaction.guild?.channels.fetch(channel.id);
      if (textChannel?.isTextBased()) {
        await textChannel.send({ embeds: [embed], components: [row] });
      }

      await interaction.reply({
        content: t(app, "ticket_setup_success", { channel: `${channel}` }),
        flags: 64,
      });
    }

    if (sub === "close") {
      const ch = interaction.channel;
      if (!ch || !ch.isTextBased() || !("name" in ch)) {
        await interaction.reply({
          content: t(app, "ticket_not_found"),
          flags: 64,
        });
        return;
      }

      const name = (ch as { name: string }).name;
      if (!name.startsWith("ticket-")) {
        await interaction.reply({
          content: t(app, "ticket_not_ticket"),
          flags: 64,
        });
        return;
      }

      await interaction.reply({ content: t(app, "ticket_closing") });
      setTimeout(async () => {
        await ch.delete().catch(() => null);
      }, 5000);
    }
  },
};
