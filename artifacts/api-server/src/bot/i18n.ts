export type Lang = "en" | "bs";

export const botLangRegistry = new Map<string, Lang>();

const translations: Record<Lang, Record<string, string>> = {
  en: {
    ticket_setup_success: "✅ Ticket panel set in {channel}!",
    ticket_not_ticket: "❌ This is not a ticket channel.",
    ticket_closing: "🔒 Ticket closing in 5 seconds...",
    ticket_not_found: "❌ This command only works inside a ticket channel.",
    ticket_open_button: "📩 Open Ticket",
    ticket_embed_title: "🎫 Support",
    ticket_embed_desc: "Click the button below to open a ticket and get help from our support team.",
    ticket_embed_footer: "Support System",
    ticket_already_open: "❌ You already have an open ticket: {channel}",
    ticket_opened_title: "🎫 Ticket Opened",
    ticket_opened_desc: "Hello {user}!\nDescribe your issue and the support team will help you.\n\nUse `/ticket close` to close this ticket.",
    ticket_opened_footer: "Support",
    ticket_opened_reply: "✅ Ticket opened: {channel}",

    panel_sent: "✅ Panel sent!",
    panel_title: "🌐 Panel",
    panel_field_support: "🎫 Support",
    panel_field_support_val: "Open a ticket for help",
    panel_field_rules: "📋 Rules",
    panel_field_rules_val: "Follow server rules",
    panel_field_news: "📢 News",
    panel_field_news_val: "Follow announcements",
    panel_btn_rules: "📋 Rules",
    panel_btn_support: "🎫 Support",
    panel_btn_website: "🌐 Website",
    panel_footer: "Hosting Panel",
    panel_rules_content: "📋 **Server Rules:**\n1. Respect all members\n2. No spam/flood\n3. No NSFW content\n4. Use channels for their purpose\n5. Follow admins/moderators",
    panel_support_content: "🎫 Open a ticket using the ticket panel or `/ticket setup`.",

    welcome_set_success: "✅ Welcome channel set to {channel}!\nMessage: `{message}`",
    welcome_default_msg: "👋 Welcome {user} to **{server}**! Hope you enjoy your stay!",
    welcome_off: "✅ Welcome messages disabled.",
    welcome_embed_title: "👋 New Member!",
    welcome_embed_user: "👤 User",
    welcome_embed_account: "📅 Account Created",
    welcome_embed_members: "👥 Member Count",

    mute_not_found: "❌ User not found.",
    mute_is_admin: "❌ Cannot mute an admin.",
    mute_success: "🔇 **{user}** has been muted for **{duration} min**.\n📋 Reason: {reason}",

    ban_is_admin: "❌ Cannot ban an admin.",
    ban_success: "🔨 **{user}** has been banned!\n📋 Reason: {reason}",

    kick_not_found: "❌ User not found.",
    kick_is_admin: "❌ Cannot kick an admin.",
    kick_success: "👢 **{user}** has been kicked!\n📋 Reason: {reason}",

    autorole_set: "✅ Auto role set to **{role}**. Every new member will automatically receive it.",
    autorole_off: "✅ Auto role disabled.",
    autorole_none: "ℹ️ No auto role set. Use `/autorole set`.",
    autorole_info: "ℹ️ Current auto role: {role}",

    no_reason: "No reason provided",
    cmd_error: "❌ An error occurred while executing this command.",
  },
  bs: {
    ticket_setup_success: "✅ Ticket panel je postavljen u {channel}!",
    ticket_not_ticket: "❌ Ovo nije ticket kanal.",
    ticket_closing: "🔒 Ticket se zatvara za 5 sekundi...",
    ticket_not_found: "❌ Ova komanda radi samo unutar ticket kanala.",
    ticket_open_button: "📩 Otvori Ticket",
    ticket_embed_title: "🎫 Support",
    ticket_embed_desc: "Klikni dugme ispod da otvoriš ticket i dobiješ pomoć od našeg support tima.",
    ticket_embed_footer: "Support sistem",
    ticket_already_open: "❌ Već imaš otvoren ticket: {channel}",
    ticket_opened_title: "🎫 Ticket Otvoren",
    ticket_opened_desc: "Pozdrav {user}!\nOpiši problem i support tim će ti pomoći.\n\nKoristi `/ticket close` za zatvaranje.",
    ticket_opened_footer: "Support",
    ticket_opened_reply: "✅ Ticket je otvoren: {channel}",

    panel_sent: "✅ Panel je poslan!",
    panel_title: "🌐 Panel",
    panel_field_support: "🎫 Support",
    panel_field_support_val: "Otvori ticket za pomoć",
    panel_field_rules: "📋 Pravila",
    panel_field_rules_val: "Poštuj pravila servera",
    panel_field_news: "📢 Novosti",
    panel_field_news_val: "Prati announcements",
    panel_btn_rules: "📋 Pravila",
    panel_btn_support: "🎫 Support",
    panel_btn_website: "🌐 Website",
    panel_footer: "Hosting Panel",
    panel_rules_content: "📋 **Pravila servera:**\n1. Poštuj sve članove\n2. Nema spam/flood poruka\n3. Nema NSFW sadržaja\n4. Koristi kanale za svoju namjenu\n5. Slušaj admins/moderatore",
    panel_support_content: "🎫 Otvori ticket koristeći ticket panel ili `/ticket setup`.",

    welcome_set_success: "✅ Welcome kanal postavljen na {channel}!\nPoruka: `{message}`",
    welcome_default_msg: "👋 Dobrodošao/la {user} na **{server}**! Nadam se da ćeš uživati!",
    welcome_off: "✅ Welcome poruke su isključene.",
    welcome_embed_title: "👋 Novi član!",
    welcome_embed_user: "👤 Korisnik",
    welcome_embed_account: "📅 Nalog kreiran",
    welcome_embed_members: "👥 Broj članova",

    mute_not_found: "❌ Korisnik nije pronađen.",
    mute_is_admin: "❌ Ne mogu da mutiram admina.",
    mute_success: "🔇 **{user}** je mutiran na **{duration} min**.\n📋 Razlog: {reason}",

    ban_is_admin: "❌ Ne mogu da banujem admina.",
    ban_success: "🔨 **{user}** je banovan!\n📋 Razlog: {reason}",

    kick_not_found: "❌ Korisnik nije pronađen.",
    kick_is_admin: "❌ Ne mogu da kickujem admina.",
    kick_success: "👢 **{user}** je kickovan!\n📋 Razlog: {reason}",

    autorole_set: "✅ Auto rola postavljena na **{role}**. Svaki novi član je automatski dobija.",
    autorole_off: "✅ Auto rola je isključena.",
    autorole_none: "ℹ️ Auto rola nije postavljena. Koristi `/autorole set`.",
    autorole_info: "ℹ️ Trenutna auto rola: {role}",

    no_reason: "Nije naveden razlog",
    cmd_error: "❌ Greška pri izvršavanju komande.",
  },
};

export function t(
  appId: string,
  key: string,
  vars?: Record<string, string>
): string {
  const lang = botLangRegistry.get(appId) ?? "bs";
  let str = translations[lang][key] ?? translations["en"][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, v);
    }
  }
  return str;
}
