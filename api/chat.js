import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { message, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ answer: "no message" });
    }

    // 📦 читаем CSV
    const filePath = path.join(process.cwd(), "products.csv");
    const csv = fs.readFileSync(filePath, "utf-8");

    const products = csv.split("\n").map(line => {
      const [name, price] = line.split(",");
      return { name, price };
    });

    // 🔍 ищем совпадения
    const query = message.toLowerCase();

    const found = products.filter(p =>
      p.name?.toLowerCase().includes(query)
    ).slice(0, 5);

    const productContext =
      found.length > 0
        ? "FOUND PRODUCTS:\n" +
          found.map(p => `${p.name} - $${p.price}`).join("\n")
        : "NO PRODUCTS FOUND";

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
            content:
              "Ты продавец магазина техники. Используй список товаров ниже. Если товар найден — показывай цену в $. Если нет — предлагай похожие товары.\n\n" +
              productContext
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      answer: data?.choices?.[0]?.message?.content || "no response"
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      answer: "server error"
    });
  }
}
