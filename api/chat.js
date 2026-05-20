export default async function handler(req, res) {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ answer: "no message" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Ты продавец-консультант магазина техники.

ВАЖНО:
- Все цены указаны в долларах США ($)
- Всегда используй валюту $
- Не переводи в другие валюты
- Если спрашивают цену — отвечай в $
- Будь кратким и понятным
- Помогай выбрать товар."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return res.status(200).json({
      answer: data?.choices?.[0]?.message?.content || "empty response"
    });

  } catch (e) {
    return res.status(500).json({
      answer: e.message
    });
  }
}
