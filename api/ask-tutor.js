// File: api/ask-tutor.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { grade, subject, level, question } = req.body;
  const isArabic = /[\u0600-\u06FF]/.test(question);
  const language = isArabic ? 'Arabic' : 'English';

  const systemPrompt = `
    You are a helpful and friendly AI tutor.
    The student is in Grade ${grade}, asking a ${subject} question at ${level} level.
    Respond clearly and step-by-step in ${language}.
    If the question is unclear or has a spelling mistake, try your best to guess and help instead of refusing.
  `;

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Set in Vercel's environment variables
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    });

    const data = await apiRes.json();
    const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not find an answer.';
    res.status(200).json({ answer });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
