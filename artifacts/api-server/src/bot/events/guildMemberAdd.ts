import { type GuildMember, EmbedBuilder } from "discord.js";
import { welcomeData } from "../commands/welcome";
import { autoRoleData } from "../commands/autorole";
import { logger } from "../../lib/logger";

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
        const message = welcomeConfig.message
          .replace("{user}", `<@${member.id}>`)
          .replace("{server}", member.guild.name);

        const embed = new EmbedBuilder()
          .setTitle("👋 Novi član!")
          .setDescription(message)
          .setColor(0x57f287)
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: "👤 Korisnik", value: `<@${member.id}>`, inline: true },
            {
              name: "📅 Nalog kreiran",
              value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: "👥 Broj članova",
              value: `${member.guild.memberCount}`,
              inline: true,
            }
          )
          .setFooter({ text: "SkyHost" })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    } catch (err) {
      logger.error({ err }, "Failed to send welcome message");
    }
  }
}
