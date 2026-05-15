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

export const ticketCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Upravljanje ticket sistemom")
    .addSubcommand((sub) =>
      sub
        .setName("setup")
        .setDescription("Postavi ticket kanal")
        .addChannelOption((opt) =>
          opt
            .setName("kanal")
            .setDescription("Kanal u koji se šalje ticket panel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName("support_rola")
            .setDescription("Rola koja vidi tickete")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("close").setDescription("Zatvori trenutni ticket")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();

    if (sub === "setup") {
      const channel = interaction.options.getChannel("kanal", true);
      const role = interaction.options.getRole("support_rola", true);

      const embed = new EmbedBuilder()
        .setTitle("🎫 SkyHost Support")
        .setDescription(
          "Klikni dugme ispod da otvoriš ticket i dobiješ pomoć od našeg support tima."
        )
        .setColor(0x5865f2)
        .setFooter({ text: "SkyHost | Support sistem" })
        .setTimestamp();

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`ticket_open:${role.id}`)
          .setLabel("📩 Otvori Ticket")
          .setStyle(ButtonStyle.Primary)
      );

      const textChannel = await interaction.guild?.channels.fetch(channel.id);
      if (textChannel?.isTextBased()) {
        await textChannel.send({ embeds: [embed], components: [row] });
      }

      await interaction.reply({
        content: `✅ Ticket panel je postavljen u ${channel}!`,
        flags: 64,
      });
    }

    if (sub === "close") {
      const ch = interaction.channel;
      if (!ch || !ch.isTextBased() || !("name" in ch)) {
        await interaction.reply({
          content: "❌ Ova komanda radi samo unutar ticket kanala.",
          flags: 64,
        });
        return;
      }

      const name = (ch as { name: string }).name;
      if (!name.startsWith("ticket-")) {
        await interaction.reply({
          content: "❌ Ovo nije ticket kanal.",
          flags: 64,
        });
        return;
      }

      await interaction.reply({ content: "🔒 Ticket se zatvara za 5 sekundi..." });
      setTimeout(async () => {
        await ch.delete().catch(() => null);
      }, 5000);
    }
  },
};
