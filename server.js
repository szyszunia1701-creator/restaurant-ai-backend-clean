import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

/* === ROUTE DEMO (ROZWIĄZANIE 2) === */
app.get("/", (req, res) => {
  res.send(`
    <h2>Asystent AI – backend online ✅</h2>
    <p>Status: <strong>aktywny</strong></p>
    <p>Endpoint: <code>POST /chat</code></p>
    <p>Wersja: demo</p>
  `);
});

/* === CHAT ENDPOINT === */
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
        Jesteś profesjonalnym asystentem restauracji „Grande Pizza”.

        ZASADY:
        - Odpowiadasz WYŁĄCZNIE na pytania o: menu, godziny otwarcia, lokalizację, rezerwacje.
        - Odpowiedzi mają być krótkie, konkretne i uprzejme.
        - Jeśli nie znasz odpowiedzi – napisz, że należy skontaktować się z restauracją.
        - NIE wymyślaj informacji.
        - NIE odpowiadaj na pytania niezwiązane z restauracją.

        DANE RESTAURACJI:
        - Godziny: pn–nd 12:00–22:00
        - Adres: ul. Przykładowa 12, Warszawa
        - Telefon: 123 456 789
        - Rezerwacje: telefonicznie lub na miejscu

        Zawsze pisz po polsku.
        `
          },
          {
            role: "user",
            content: userMessage
          }
        ]

      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Błąd serwera" });
  }
});

/* === LISTEN === */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server działa na porcie " + PORT);
});
