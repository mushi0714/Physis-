const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeUserOnboarding = async (userData, answers) => {
  console.log(`🧠 Synapse active for: ${userData.email}...`);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const languageName = userData.language === 'es' ? 'Spanish' : 'English';

    const prompt = `
      Analyze goal: "${answers.goal}".
      Respond in ${languageName}.
      Classify into: Prosper, Serenity, Scholar.
      Return ONLY a flat JSON:
      {"nicheName": "Niche Name", "greeting": "Short welcome message", "nicheId": 1}
      Ids: Prosper=1, Serenity=2, Scholar=3.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Regex fix: one line, no breaks
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const aiResponse = JSON.parse(cleanJson);
    return aiResponse;

  } catch (error) {
    console.error("❌ GEMINI ERROR:", error.message);
    return {
      nicheName: "Serenity",
      nicheId: 2,
      greeting: userData.language === 'es' ? "Bienvenido a Physis." : "Welcome to Physis."
    };
  }
};

module.exports = { analyzeUserOnboarding };