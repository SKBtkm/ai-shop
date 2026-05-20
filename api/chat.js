export default async function handler(req, res) {
  try {
    const body = req.body ? req.body : await parseBody(req);
    const message = body?.message;

    if (!message) {
      return res.status(400).json({ answer: "no message" });
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "Ты помощник магазина. Отвечай кратко, помогай выбрать товар."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json().catch(() => ({}));

    console.log("XAI RESPONSE:", data);

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "empty response";

    res.status(200).json({ answer });

  } catch (err) {
    console.error("CRASH ERROR:", err);

    res.status(500).json({
      answer: "server crashed"
    });
  }
}

// безопасный парсер body (Vercel fix)
async function parseBody(req) {
  return new Promise((resolve) => {
    let data = "";

    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        resolve({});
      }
    });
  });
}
