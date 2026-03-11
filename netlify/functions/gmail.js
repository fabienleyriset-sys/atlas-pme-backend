const https = require("https");
const pdf   = require("pdf-parse");

// ── HTTP helpers ───────────────────────────────────────────────────────────────
function httpsPost(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const u    = new URL(url);
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const req  = https.request(
      {
        hostname: u.hostname,
        path:     u.pathname + u.search,
        method:   "POST",
        headers:  { "Content-Length": Buffer.byteLength(data), ...headers },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end",  () => resolve({ status: res.statusCode, body: d }));
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// Generic GET — returns raw Buffer when binary=true
function httpsGet(url, headers = {}, binary = false) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https
      .get({ hostname: u.hostname, path: u.pathname + u.search, headers }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end",  () => {
          const buf = Buffer.concat(chunks);
          resolve({
            status: res.statusCode,
            body:   binary ? buf : buf.toString("utf-8"),
          });
        });
      })
      .on("error", reject);
  });
}

// ── Gmail helpers ──────────────────────────────────────────────────────────────
function decodeBase64(str) {
  try {
    return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

function decodeBase64Binary(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64");
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

// Collect all attachment parts (PDF + images) recursively
function extractAttachmentParts(payload, parts = []) {
  if (!payload) return parts;
  if (payload.parts) {
    for (const p of payload.parts) {
      const isPDF   = p.mimeType === "application/pdf" || p.filename?.toLowerCase().endsWith(".pdf");
      const isImage = p.mimeType?.startsWith("image/");
      if ((isPDF || isImage) && (p.body?.attachmentId || p.body?.data)) {
        parts.push({
          filename:     p.filename || "attachment",
          mimeType:     p.mimeType,
          attachmentId: p.body?.attachmentId || null,
          data:         p.body?.data || null,        // inline base64
          isPDF,
          isImage,
        });
      }
      extractAttachmentParts(p, parts);
    }
  }
  return parts;
}

// Fetch full attachment binary by attachmentId
async function fetchAttachmentData(msgId, attachmentId, accessToken) {
  const res = await httpsGet(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}/attachments/${attachmentId}`,
    { Authorization: `Bearer ${accessToken}` }
  );
  const json = JSON.parse(res.body);
  return json.data ? decodeBase64Binary(json.data) : null;
}

// Extract text from PDF buffer using pdf-parse
async function extractPdfText(buffer) {
  try {
    const result = await pdf(buffer);
    return result.text?.trim().slice(0, 4000) || "";   // cap at 4 000 chars
  } catch {
    return "";
  }
}

// Send image to Claude Vision and get extracted text
async function extractImageText(buffer, mimeType) {
  try {
    const base64 = buffer.toString("base64");
    const res = await httpsPost(
      "https://api.anthropic.com/v1/messages",
      {
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{
          role:    "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
            { type: "text",  text:    "Extrais tout le texte visible de cette pièce jointe (facture, document). Réponds uniquement avec le texte extrait, sans commentaire." },
          ],
        }],
      },
      {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      }
    );
    const json = JSON.parse(res.body);
    return json.content?.[0]?.text?.trim() || "";
  } catch {
    return "";
  }
}

// Analyse email + attachments with Claude
async function analyzeWithAI(emailData) {
  try {
    const attachmentBlock = emailData.attachments.length > 0
      ? `\n\n--- CONTENU DES PIÈCES JOINTES (${emailData.attachments.length}) ---\n` +
        emailData.attachments.map((a, i) =>
          `[PJ ${i+1} — ${a.filename}]\n${a.text || "(texte non extrait)"}`
        ).join("\n\n")
      : "";

    const prompt =
      `Analyse cet email professionnel et ses pièces jointes pour une PME.\n\n` +
      `De : ${emailData.from}\n` +
      `Sujet : ${emailData.subject}\n` +
      `Corps :\n${emailData.body}` +
      attachmentBlock +
      `\n\n---\nFournis une analyse structurée :\n` +
      `1. RÉSUMÉ (2 lignes max)\n` +
      `2. TYPE (facture / commande / devis / document / commercial)\n` +
      `3. MONTANT TTC (si facture — extrais le montant exact)\n` +
      `4. ÉCHÉANCE (si facture)\n` +
      `5. IBAN / RIB (si présent)\n` +
      `6. ACTIONS REQUISES\n` +
      `7. PRIORITÉ (urgent / normal / faible)`;

    const res = await httpsPost(
      "https://api.anthropic.com/v1/messages",
      {
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system:     "Tu es un assistant financier PME. Réponds en français, de façon structurée et concise.",
        messages:   [{ role: "user", content: prompt }],
      },
      {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      }
    );
    const json = JSON.parse(res.body);
    return json.content?.[0]?.text?.trim() || "";
  } catch {
    return "";
  }
}

function parseMessage(msg) {
  const headers    = msg.payload?.headers || [];
  const get        = (n) => headers.find((h) => h.name.toLowerCase() === n.toLowerCase())?.value || "";
  const from       = get("From");
  const emailMatch = from.match(/<(.+?)>/) || from.match(/(\S+@\S+)/);
  const fromEmail  = emailMatch ? emailMatch[1] : from;
  const senderName = from.replace(/<.+?>/, "").trim().replace(/"/g, "") || fromEmail;

  const date      = new Date(parseInt(msg.internalDate));
  const now       = new Date();
  const isToday   = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
  const dateStr   = isToday
    ? `Aujourd'hui ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
    : isYesterday ? "Hier"
    : `${date.getDate()}/${date.getMonth() + 1}`;

  const body       = extractBody(msg.payload);
  const subject    = get("Subject") || "(Sans objet)";
  const subjectLow = subject.toLowerCase();
  const type       =
    subjectLow.includes("facture") || subjectLow.includes("invoice")   ? "facture"
    : subjectLow.includes("commande") || subjectLow.includes("order")  ? "commande"
    : subjectLow.includes("devis")                                      ? "commercial"
    : subjectLow.includes("relance") || subjectLow.includes("document")? "document"
    : "commercial";

  const rawAttachments = extractAttachmentParts(msg.payload);

  return {
    id:              msg.id,
    from:            fromEmail,
    sender:          senderName,
    subject,
    preview:         body.substring(0, 100).replace(/\n/g, " ") + "…",
    date:            dateStr,
    type,
    urgent:          (msg.labelIds || []).includes("UNREAD"),
    body:            body || "(Corps vide)",
    rawAttachments,  // to be enriched async
  };
}

// ── Main handler ───────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const CORS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    // 1 — Access token
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
      return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: "Token invalide", detail: tokenData }) };
    }
    const accessToken = tokenData.access_token;

    // 2 — List messages
    const maxResults = event.queryStringParameters?.max || 25;
    const listRes    = await httpsGet(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
      { Authorization: `Bearer ${accessToken}` }
    );
    const listData = JSON.parse(listRes.body);
    if (!listData.messages) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify([]) };
    }

    // 3 — Fetch full messages
    const messages = await Promise.all(
      listData.messages.map((m) =>
        httpsGet(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`,
          { Authorization: `Bearer ${accessToken}` }
        ).then((r) => JSON.parse(r.body))
      )
    );

    // 4 — Parse + enrich attachments + IA analysis
    const parsed = await Promise.all(
      messages.map(async (msg) => {
        const email = parseMessage(msg);

        // Download & extract text from attachments
        const attachments = await Promise.all(
          email.rawAttachments.map(async (att) => {
            let buffer = null;
            if (att.attachmentId) {
              buffer = await fetchAttachmentData(msg.id, att.attachmentId, accessToken);
            } else if (att.data) {
              buffer = decodeBase64Binary(att.data);
            }
            let text = "";
            if (buffer) {
              if (att.isPDF)        text = await extractPdfText(buffer);
              else if (att.isImage) text = await extractImageText(buffer, att.mimeType);
            }
            return { filename: att.filename, mimeType: att.mimeType, text };
          })
        );

        // IA analysis (only if attachments present OR email is unread/facture)
        let aiAnalysis = "";
        const shouldAnalyze = attachments.length > 0 || email.urgent || email.type === "facture";
        if (shouldAnalyze && process.env.ANTHROPIC_API_KEY) {
          aiAnalysis = await analyzeWithAI({ ...email, attachments });
        }

        // Clean up rawAttachments before returning
        const { rawAttachments, ...cleanEmail } = email;
        return {
          ...cleanEmail,
          attachments: attachments.map((a) => ({ filename: a.filename, hasText: !!a.text })),
          aiAnalysis,
        };
      })
    );

    return {
      statusCode: 200,
      headers:    { ...CORS, "Content-Type": "application/json" },
      body:       JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers:    CORS,
      body:       JSON.stringify({ error: err.message }),
    };
  }
};
