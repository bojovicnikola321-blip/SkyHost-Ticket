import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../index";
import { t } from "../i18n";

export const welcomeData: Map<string, { channelId: string; message: string }> = new Map();

export const welcomeCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Set welcome channel and message")
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Set welcome channel")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Welcome channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("message")
            .setDescription("Welcome message. Use {user} for mention and {server} for server name.")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("off").setDescription("Disable welcome messages")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId!;
    const app = interaction.applicationId;

    if (sub === "set") {
      const channel = interaction.options.getChannel("channel", true);
      const message =
        interaction.options.getString("message") ?? t(app, "welcome_default_msg");

      welcomeData.set(guildId, { channelId: channel.id, message });

      await interaction.reply({
        content: t(app, "welcome_set_success", { channel: `${channel}`, message }),
        flags: 64,
      });
    }

    if (sub === "off") {
      welcomeData.delete(guildId);
      await interaction.reply({ content: t(app, "welcome_off"), flags: 64 });
    }
  },
};
