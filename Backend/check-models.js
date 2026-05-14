// check-models.js
const API_KEY = "AIzaSyA8ihn_RFSNriiaK9-OlAk_UbRUrQv9GLM"; // ⚠️ Pega tu clave real de Gemini aquí

async function check() {
  console.log("🔍 Preguntándole a Google qué modelos tienes habilitados...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Error de Google:", data.error.message);
      return;
    }

    console.log("\n✅ ESTOS SON TUS MODELOS DISPONIBLES:");
    console.log("-------------------------------------------------");
    const modelNames = data.models.map(m => m.name.replace('models/', ''));
    console.log(modelNames.join('\n'));
    console.log("-------------------------------------------------");
    
  } catch (error) {
    console.error("❌ Error de red:", error);
  }
}

check();