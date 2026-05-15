import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes,
  type SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { logger } from "../lib/logger";
import { ticketCommand } from "./commands/ticket";
import { panelCommand } from "./commands/panel";
import { welcomeCommand } from "./commands/welcome";
import { muteCommand } from "./commands/mute";
import { banCommand } from "./commands/ban";
import { kickCommand } from "./commands/kick";
import { autoroleCommand } from "./commands/autorole";
import { handleGuildMemberAdd } from "./events/guildMemberAdd";
import { handleInteractionCreate } from "./events/interactionCreate";

export type BotCommand = {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const commands = new Collection<string, BotCommand>();

const allCommands: BotCommand[] = [
  ticketCommand,
  panelCommand,
  welcomeCommand,
  muteCommand,
  banCommand,
  kickCommand,
  autoroleCommand,
];

for (const cmd of allCommands) {
  commands.set(cmd.data.name, cmd);
}

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    logger.error("DISCORD_TOKEN is not set — bot will not start");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  client.once("ready", async (c) => {
    logger.info({ tag: c.user.tag }, "Discord bot is ready");

    const rest = new REST().setToken(token);
    const commandData = allCommands.map((cmd) => cmd.data.toJSON());

    try {
      await rest.put(Routes.applicationCommands(c.user.id), {
        body: commandData,
      });
      logger.info("Slash commands registered globally");
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });

  client.on("guildMemberAdd", (member) => handleGuildMemberAdd(member));
  client.on("interactionCreate", (interaction) =>
    handleInteractionCreate(interaction)
  );

  await client.login(token);
}
