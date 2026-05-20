export default async function handler(req, res) {
  try {
    const message = req.body?.message;

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
            content: "Ты продавец магазина. Отвечай кратко."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const text = await response.text();

    console.log("RAW XAI RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        answer: "xAI returned non-JSON: " + text
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      JSON.stringify(data);

    return res.status(200).json({ answer });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      answer: err.message
    });
  }
}
