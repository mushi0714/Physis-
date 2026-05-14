// test-ai.js

async function testPhysisAI() {
  // ⚠️ REEMPLAZA ESTO con el ID real que copiaste de tu tabla 'users' en pgAdmin
  const myUserId = "2b58f1c5-5c82-4f9d-97bf-32b8e7ad70ae";

  // Simulamos las respuestas que daría un usuario en la app
  const payload = {
    userId: myUserId,
    answers: {
      name: "Coordinador",
      goal: "Me cuesta mucho mantener la concentración. Necesito prepararme para unos exámenes finales muy difíciles y quiero desarrollar el hábito de la lectura profunda."
    }
  };

  console.log("🚀 Enviando objetivo al cerebro de Physis (Gemini)...");

  try {
    const response = await fetch("http://localhost:3000/api/onboarding/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("\n🧠 Respuesta de la IA y Base de Datos:");
    console.log("-------------------------------------------------");
    console.log(JSON.stringify(data, null, 2));
    console.log("-------------------------------------------------");
    
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
}

testPhysisAI();