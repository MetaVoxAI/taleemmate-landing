export default async function handler(req, res) {
  try {
    const { grade, subject, level, question } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return res.status(500).json({ error: "API key not found" });
    }

    const prompt = `Act as an AI tutor. Grade: ${grade}. Subject: ${subject}. Level: ${level}. Question: ${question}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
