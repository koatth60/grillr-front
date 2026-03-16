import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate interview questions from a job description.
 * Claude reads the JD and returns 5 tailored questions as JSON.
 */
export async function generateQuestions(
  jobTitle: string,
  jobDescription: string
): Promise<string[]> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert technical interviewer. Given the following job description, generate exactly 5 interview questions that are tailored to this specific role. Mix behavioral, technical, and situational questions.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Respond ONLY with a valid JSON array of 5 strings, no explanation. Example:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "[]";
  return JSON.parse(text);
}

/**
 * Evaluate a candidate's answer to an interview question.
 * Returns structured feedback with a score 1-10.
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  jobTitle: string
): Promise<{ feedback: string; score: number }> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are an expert interviewer for ${jobTitle} positions. Evaluate this candidate answer.

Question: ${question}
Answer: ${answer}

Give concise feedback (2-3 sentences) and a score from 1 to 10. Respond ONLY with valid JSON:
{"feedback": "Your feedback here.", "score": 7}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text"
      ? message.content[0].text
      : '{"feedback":"Could not evaluate.","score":5}';
  return JSON.parse(text);
}
