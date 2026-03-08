const https = require("https");

// ── HTTP helpers ──────────────────────────────────────────────────────────────
function httpsPost(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "POST",
        headers: { "Content-Length": Buffer.byteLength(data), ...headers },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https
      .get({ hostname: u.hostname, path: u.pathname + u.search, headers }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", reject);
  });
}

// ── Gmail helpers ─────────────────────────────────────────────────────────────
function decodeBase64(str) {
  try {
    return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function extractBody(payload) {
  if (!payload) return "";
  if (payload.body?.data) return decodeBase64(payload.body.data);
  if (payload.parts) {
    for (const p of payload.parts) {
      if (p.mimeType === "text/plain" && p.body?.data) return decodeBase64(p.body.data);
    }
    for (const p of payload.parts) {
      const sub = extractBody(p);
      if (sub) return sub;
    }
  }
  return "";
}

function parseMessage(msg) {
  const headers = msg.payload?.headers || [];
  const get = (n) => headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value || "";
  const from = get("From");
  const emailMatch = from.match(/<(.+?)>/) || from.match(/(\S+@\S+)/);
  const fromEmail = emailMatch ? emailMatch[1] : from;
  const senderName = from.replace(/<.+?>/, "").trim().replace(/"/g, "") || fromEmail;
  const date = new Date(parseInt(msg.internalDate));
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
  const dateStr = isToday
    ? `Aujourd'hui ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
    : isYesterday
    ? "Hier"
    : `${date.getDate()}/${date.getMonth() + 1}`;
  const body = extractBody(msg.payload);
  const subject = get("Subject") || "(Sans objet)";
  const subjectLow = subject.toLowerCase();
  const type =
    subjectLow.includes("facture") || subjectLow.includes("invoice")
      ? "facture"
      : subjectLow.includes("commande") || subjectLow.includes("order")
      ? "commande"
      : subjectLow.includes("devis")
      ? "commercial"
      : subjectLow.includes("relance") || subjectLow.includes("document")
      ? "document"
      : "commercial";
  return {
    id: msg.id,
    from: fromEmail,
    sender: senderName,
    subject,
    preview: body.substring(0, 100).replace(/\n/g, " ") + "…",
    date: dateStr,
    type,
    urgent: (msg.labelIds || []).includes("UNREAD"),
    body: body || "(Corps vide)",
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    // 1. Get access token using refresh token
    const tokenRes = await httpsPost(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        client_id:     process.env.GMAIL_CLIENT_ID,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        grant_type:    "refresh_token",
      }).toString(),
      { "Content-Type": "application/x-www-form-urlencoded" }
    );

    const tokenData = JSON.parse(tokenRes.body);
    if (!tokenData.access_token) {
      return {
        statusCode: 401,
        headers: CORS,
        body: JSON.stringify({ error: "Token invalide", detail: tokenData }),
      };
    }
    const accessToken = tokenData.access_token;

    // 2. List messages
    const maxResults = event.queryStringParameters?.max || 25;
    const listRes = await httpsGet(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
      { Authorization: `Bearer ${accessToken}` }
    );
    const listData = JSON.parse(listRes.body);
    if (!listData.messages) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify([]) };
    }

    // 3. Fetch each message
    const messages = await Promise.all(
      listData.messages.map((m) =>
        httpsGet(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,
          { Authorization: `Bearer ${accessToken}` }
        ).then((r) => JSON.parse(r.body))
      )
    );

    const parsed = messages.map(parseMessage);

    return {
      statusCode: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
