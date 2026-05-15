import {
  type Interaction,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { commands } from "../index";
import { logger } from "../../lib/logger";

export async function handleInteractionCreate(
  interaction: Interaction
): Promise<void> {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      logger.error({ err, command: interaction.commandName }, "Command error");
      const msg = { content: "❌ Greška pri izvršavanju komande.", flags: 64 as const };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
    return;
  }

  if (interaction.isButton()) {
    const { customId, guild, member } = interaction;

    if (customId.startsWith("ticket_open:")) {
      const supportRoleId = customId.split(":")[1];

      if (!guild) return;

      const existing = guild.channels.cache.find(
        (ch) =>
          ch.type === ChannelType.GuildText &&
          "name" in ch &&
          ch.name === `ticket-${interaction.user.username.toLowerCase()}`
      );

      if (existing) {
        await interaction.reply({
          content: `❌ Već imaš otvoren ticket: ${existing}`,
          flags: 64,
        });
        return;
      }

      const channel = await guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: supportRoleId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.ManageMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket Otvoren")
        .setDescription(
          `Pozdrav <@${interaction.user.id}>!\nOpiši problem i support tim će ti pomoći.\n\nKoristi \`/ticket close\` za zatvaranje.`
        )
        .setColor(0x5865f2)
        .setFooter({ text: "SkyHost Support" })
        .setTimestamp();

      await channel.send({
        content: `<@${interaction.user.id}> | <@&${supportRoleId}>`,
        embeds: [embed],
      });

      await interaction.reply({
        content: `✅ Ticket je otvoren: ${channel}`,
        flags: 64,
      });
    }

    if (customId === "panel_rules") {
      await interaction.reply({
        content:
          "📋 **Pravila servera:**\n1. Poštuj sve članove\n2. Nema spam/flood poruka\n3. Nema NSFW sadržaja\n4. Koristi kanale za svoju namjenu\n5. Slušaj admins/moderatore",
        flags: 64,
      });
    }

    if (customId === "panel_support") {
      await interaction.reply({
        content: "🎫 Otvori ticket koristeći ticket panel ili `/ticket setup`.",
        flags: 64,
      });
    }
  }
}
