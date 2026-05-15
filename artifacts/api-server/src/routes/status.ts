import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkyHost Bot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-radius: 16px;
      padding: 40px 48px;
      max-width: 560px;
      width: 90%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .logo { font-size: 64px; margin-bottom: 12px; }
    h1 { font-size: 2rem; color: #5865f2; margin-bottom: 6px; }
    .tagline { color: #888; margin-bottom: 28px; font-size: 0.95rem; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e3a2e;
      border: 1px solid #2d6a4f;
      color: #57f287;
      padding: 8px 20px;
      border-radius: 100px;
      font-weight: 600;
      margin-bottom: 32px;
    }
    .dot {
      width: 10px; height: 10px;
      background: #57f287;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .commands {
      text-align: left;
      background: #12121f;
      border-radius: 12px;
      overflow: hidden;
    }
    .commands-title {
      padding: 14px 20px;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      border-bottom: 1px solid #2a2a4a;
    }
    .cmd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #1e1e30;
      gap: 16px;
    }
    .cmd:last-child { border-bottom: none; }
    .cmd-name { color: #5865f2; font-family: monospace; font-size: 0.9rem; flex-shrink: 0; }
    .cmd-desc { color: #999; font-size: 0.85rem; text-align: right; }
    .footer { margin-top: 24px; color: #555; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🌐</div>
    <h1>SkyHost Bot</h1>
    <p class="tagline">Discord bot za SkyHost server</p>
    <div class="status-badge">
      <div class="dot"></div>
      Online &amp; aktivan
    </div>
    <div class="commands">
      <div class="commands-title">Dostupne komande</div>
      <div class="cmd"><span class="cmd-name">/ticket setup</span><span class="cmd-desc">Postavi ticket panel</span></div>
      <div class="cmd"><span class="cmd-name">/ticket close</span><span class="cmd-desc">Zatvori ticket</span></div>
      <div class="cmd"><span class="cmd-name">/panel</span><span class="cmd-desc">Info/admin panel embed</span></div>
      <div class="cmd"><span class="cmd-name">/welcome set</span><span class="cmd-desc">Postavi welcome kanal</span></div>
      <div class="cmd"><span class="cmd-name">/welcome off</span><span class="cmd-desc">Isključi welcome poruke</span></div>
      <div class="cmd"><span class="cmd-name">/mute</span><span class="cmd-desc">Timeout korisnika</span></div>
      <div class="cmd"><span class="cmd-name">/ban</span><span class="cmd-desc">Ban korisnika</span></div>
      <div class="cmd"><span class="cmd-name">/kick</span><span class="cmd-desc">Kick korisnika</span></div>
      <div class="cmd"><span class="cmd-name">/autorole set/off/info</span><span class="cmd-desc">Upravljanje auto rolom</span></div>
    </div>
    <p class="footer">SkyHost &copy; 2026 &mdash; Powered by discord.js v14</p>
  </div>
</body>
</html>`);
});

export default router;
