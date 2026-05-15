import {
  type Interaction,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
import { commands } from "../index";
import { logger } from "../../lib/logger";
import { t } from "../i18n";

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
      const msg = { content: t(interaction.applicationId, "cmd_error"), flags: 64 as const };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
    return;
  }

  if (interaction.isButton()) {
    const { customId, guild } = interaction;
    const app = interaction.applicationId;

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
          content: t(app, "ticket_already_open", { channel: `${existing}` }),
          flags: 64,
        });
        return;
      }

      const channel = await guild.channels.create({
        name: `ticket-${interaction.user.username.toLowerCase()}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
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
        .setTitle(t(app, "ticket_opened_title"))
        .setDescription(
          t(app, "ticket_opened_desc", { user: `<@${interaction.user.id}>` })
        )
        .setColor(0x5865f2)
        .setFooter({ text: t(app, "ticket_opened_footer") })
        .setTimestamp();

      await channel.send({
        content: `<@${interaction.user.id}> | <@&${supportRoleId}>`,
        embeds: [embed],
      });

      await interaction.reply({
        content: t(app, "ticket_opened_reply", { channel: `${channel}` }),
        flags: 64,
      });
    }

    if (customId === "panel_rules") {
      await interaction.reply({ content: t(app, "panel_rules_content"), flags: 64 });
    }

    if (customId === "panel_support") {
      await interaction.reply({ content: t(app, "panel_support_content"), flags: 64 });
    }
  }
}
