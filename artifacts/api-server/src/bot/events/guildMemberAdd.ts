import { type GuildMember, EmbedBuilder } from "discord.js";
import { welcomeData } from "../commands/welcome";
import { autoRoleData } from "../commands/autorole";
import { logger } from "../../lib/logger";
import { t, botLangRegistry } from "../i18n";

export async function handleGuildMemberAdd(member: GuildMember): Promise<void> {
  const guildId = member.guild.id;

  const roleId = autoRoleData.get(guildId);
  if (roleId) {
    try {
      await member.roles.add(roleId);
      logger.info({ user: member.user.tag, roleId }, "Auto role assigned");
    } catch (err) {
      logger.error({ err }, "Failed to assign auto role");
    }
  }

  const welcomeConfig = welcomeData.get(guildId);
  if (welcomeConfig) {
    try {
      const channel = await member.guild.channels.fetch(welcomeConfig.channelId);
      if (channel?.isTextBased()) {
        const appId = member.client.user.id;

        const message = welcomeConfig.message
          .replace("{user}", `<@${member.id}>`)
          .replace("{server}", member.guild.name);

        const embed = new EmbedBuilder()
          .setTitle(t(appId, "welcome_embed_title"))
          .setDescription(message)
          .setColor(0x57f287)
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: t(appId, "welcome_embed_user"),    value: `<@${member.id}>`, inline: true },
            {
              name: t(appId, "welcome_embed_account"),
              value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: t(appId, "welcome_embed_members"),
              value: `${member.guild.memberCount}`,
              inline: true,
            }
          )
          .setFooter({ text: member.guild.name })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    } catch (err) {
      logger.error({ err }, "Failed to send welcome message");
    }
  }
}
