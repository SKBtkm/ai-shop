export default async function handler(req, res) {
  try {
    const key = process.env.GROQ_API_KEY;

    if (!key) {
      return res.status(200).json({
        ok: false,
        step: "env_check",
        error: "GROQ_API_KEY is EMPTY in Vercel"
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${key}`
      }
    });

    const text = await response.text();

    return res.status(200).json({
      ok: true,
      step: "api_called",
      raw: text
    });

  } catch (e) {
    return res.status(200).json({
      ok: false,
      step: "catch_error",
      error: e.message,
      stack: e.stack
    });
  }
}
