export default async function handler(req, res) {
  try {
    const { message, systemPrompt } = req.body;

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
            content: systemPrompt || "Ты продавец-консультант магазина техники. Отвечай кратко и по делу."
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

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      JSON.stringify(data);

    return res.status(200).json({ answer });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      answer: "Server Error"
    });
  }
}
