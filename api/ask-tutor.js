export default async function handler(req, res) {
  try {
    const { grade, subject, level, question } = req.body;

    const prompt = `You are an AI tutor. Grade: ${grade}. Subject: ${subject}. Difficulty: ${level}.
    Help the student with the following question in a simple way:\n\n${question}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-3.5-turbo"
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    const answer = data.choices?.[0]?.message?.content || "No answer found.";
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
