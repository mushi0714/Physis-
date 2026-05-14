const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeUserOnboarding = async (userData, answers) => {
  console.log(`🧠 Synapse active for: ${userData.email}...`);
  
  try {
    // 🔥 CAMBIO CRÍTICO: Usamos 'gemini-2.5-flash', el modelo activo actual de Google.
    // (Google retiró de sus servidores las versiones 1.5 y pro antiguas).
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const languageName = userData.language === 'es' ? 'Spanish' : 'English';

    const prompt = `
      Analyze this user goal: "${answers.goal}".
      Respond ONLY in ${languageName}.
      
      Act as a neuro-coach. Classify the user into one of these niches: Prosper, Serenity, Scholar.
      Then, create a daily protocol with exactly 3 actionable, highly specific micro-habits (under 10 mins each) to help them achieve their goal.
      
      Return ONLY a flat JSON object with this exact structure (no markdown, no extra text):
      {
        "nicheName": "Niche Name",
        "greeting": "Short profound welcome message (max 15 words)",
        "nicheId": 1,
        "protocol": [
          {"title": "Short title of habit 1", "duration": "5 min"},
          {"title": "Short title of habit 2", "duration": "10 min"},
          {"title": "Short title of habit 3", "duration": "5 min"}
        ]
      }
      
      Ids: Prosper=1, Serenity=2, Scholar=3.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpiamos el formato markdown si la IA lo envía por accidente
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const aiResponse = JSON.parse(cleanJson);
    console.log(`✅ AI Protocol generated successfully for niche: ${aiResponse.nicheName}`);
    return aiResponse;

  } catch (error) {
    console.error("❌ GEMINI ERROR:", error.message);
    // Fallback de emergencia para que la pantalla NUNCA se quede en blanco aunque Google falle
    return {
      nicheName: "Serenity",
      nicheId: 2,
      greeting: userData.language === 'es' ? "Bienvenido a Physis." : "Welcome to Physis.",
      protocol: [
        { title: userData.language === 'es' ? "Respiración profunda" : "Deep breathing", duration: "5 min" },
        { title: userData.language === 'es' ? "Hidratación" : "Hydration", duration: "1 min" },
        { title: userData.language === 'es' ? "Enfoque visual" : "Visual focus", duration: "2 min" }
      ]
    };
  }
};

module.exports = { analyzeUserOnboarding };