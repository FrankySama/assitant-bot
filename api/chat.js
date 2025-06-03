export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ reply: "Aucun message fourni." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Erreur de réponse.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return res.status(500).json({ reply: "Erreur serveur." });
  }
}
