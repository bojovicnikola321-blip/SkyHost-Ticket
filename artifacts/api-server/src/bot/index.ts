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

async function startSingleBot(token: string, label: string): Promise<void> {
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
    logger.info({ tag: c.user.tag, label }, "Discord bot is ready");

    const rest = new REST().setToken(token);
    const commandData = allCommands.map((cmd) => cmd.data.toJSON());

    try {
      await rest.put(Routes.applicationCommands(c.user.id), {
        body: commandData,
      });
      logger.info({ label }, "Slash commands registered globally");
    } catch (err) {
      logger.error({ err, label }, "Failed to register slash commands");
    }
  });

  client.on("guildMemberAdd", (member) => handleGuildMemberAdd(member));
  client.on("interactionCreate", (interaction) =>
    handleInteractionCreate(interaction)
  );

  client.on("error", (err) => {
    logger.error({ err, label }, "Discord client error");
  });

  await client.login(token);
}

export async function startBot(): Promise<void> {
  const tokenKeys = [
    { key: "DISCORD_TOKEN", label: "Bot 1 (SkyHost)" },
    { key: "DISCORD_TOKEN_2", label: "Bot 2" },
    { key: "DISCORD_TOKEN_3", label: "Bot 3" },
    { key: "DISCORD_TOKEN_4", label: "Bot 4" },
  ];

  const startPromises: Promise<void>[] = [];

  for (const { key, label } of tokenKeys) {
    const token = process.env[key];
    if (!token) {
      logger.warn({ key }, `Token not set — ${label} will not start`);
      continue;
    }

    startPromises.push(
      startSingleBot(token, label).catch((err) => {
        logger.error({ err, label }, "Bot failed to start");
      })
    );
  }

  if (startPromises.length === 0) {
    logger.error("No Discord tokens found — no bots will start");
    return;
  }

  await Promise.all(startPromises);
}
