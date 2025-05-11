import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateNextQuestion(previousAnswers) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    User has answered: ${JSON.stringify(previousAnswers)}.
    Based on these, ask the next question to evaluate their skills for a job.
    Only return the next question text, no other comments.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return text.trim();
}

export default generateNextQuestion;
