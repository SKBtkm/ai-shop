export default async function handler(req, res) {
  try {
    const body = req.body || {};
    const message = body.message;

    if (!message) {
      return res.status(400).json({ answer: "нет сообщения" });
    }

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          {
            role: "system",
            content: "Ты продавец-консультант в магазине техники. Отвечай кратко и понятно. Если спрашивают товар — помогай выбрать."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("XAI RAW RESPONSE:", data);

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      data?.error?.message ||
      "Не удалось получить ответ от AI";

    return res.status(200).json({ answer });

  } catch (error) {
    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      answer: "Ошибка сервера"
    });
  }
}
