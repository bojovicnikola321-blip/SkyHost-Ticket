# SkyHost Discord Bot

Discord bot za server **SkyHost** — ticket sistem, welcome poruke, moderacija i auto role.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — pokretanje servera i bota (port 5000)
- `pnpm run typecheck` — typecheck svih paketa
- Required env: `DISCORD_TOKEN` — Discord bot token

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Discord: discord.js v14
- Build: esbuild (ESM bundle)

## Where things live

- `artifacts/api-server/src/bot/` — sav bot kod
- `artifacts/api-server/src/bot/commands/` — slash komande
- `artifacts/api-server/src/bot/events/` — event handleri
- `artifacts/api-server/src/index.ts` — pokretanje servera + bota

## Bot komande

| Komanda | Opis |
|---|---|
| `/ticket setup` | Postavi ticket panel u kanal |
| `/ticket close` | Zatvori ticket kanal |
| `/panel` | Pošalji info panel embed |
| `/welcome set` | Postavi welcome kanal i poruku |
| `/welcome off` | Isključi welcome poruke |
| `/mute` | Timeout korisnika (1 min – 28 dana) |
| `/ban` | Ban korisnika |
| `/kick` | Kick korisnika |
| `/autorole set` | Postavi auto rolu za nove članove |
| `/autorole off` | Isključi auto rolu |
| `/autorole info` | Prikaži trenutnu auto rolu |

## Architecture decisions

- Bot i Express server rade u istom procesu
- Welcome config i auto role podaci čuvaju se u memoriji (Map) — resetuju se pri restartu
- Slash komande se registruju globalno pri svakom pokretanju bota

## User preferences

- Korisnik govori bosanski/srpski/hrvatski jezik

## Gotchas

- Pri promjeni slash komandi, Discord može trebati do 1h da ih propagira globalno
- Welcome i autorole podaci se gube pri restartu — u budućoj verziji dodati DB perzistenciju
