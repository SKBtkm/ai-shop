export default async function handler(req, res) {
  const { message } = req.body;

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
          content: "Ты помощник магазина. Отвечай коротко и помогай выбрать товар."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();

  res.status(200).json({
    answer: data.choices?.[0]?.message?.content || "Ошибка"
  });
}
