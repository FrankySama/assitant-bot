export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const body = req.body || {};

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: body.message }]
      })
    });

    const data = await openaiRes.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Erreur !" });
  } catch (err) {
    console.error("Erreur API OpenAI:", err);
    res.status(500).json({ reply: "Erreur serveur avec l'IA." });
  }
}
