import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const filePath = path.join(process.cwd(), "products.csv");
    const csv = fs.readFileSync(filePath, "utf-8");

    const products = csv
      .split("\n")
      .filter(Boolean)
      .map(line => {
        const [name, price] = line.split(",");
        return { name, price };
      });

    // 🔥 УМНЫЙ ПОИСК (НЕ EXACT MATCH)
    const queryWords = message.toLowerCase().split(" ");

    const found = products.filter(p => {
      const name = p.name.toLowerCase();
      return queryWords.some(word => name.includes(word));
    }).slice(0, 5);

    const productText =
      found.length > 0
        ? found.map(p => `${p.name} - $${p.price}`).join("\n")
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
            content: `
Ты продавец магазина.

ВАЖНО:
- У тебя есть список товаров ниже
- Если есть совпадения — ОБЯЗАТЕЛЬНО показывай их
- Если нет точного совпадения — предлагай похожие товары
- Не говори "нет товаров", если есть хоть частичное совпадение

ТОВАРЫ:
${productText}
`
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
      answer: data?.choices?.[0]?.message?.content || "error"
    });

  } catch (e) {
    return res.status(500).json({
      answer: e.message
    });
  }
}
