import { WORKER_URL } from "./secrets.js";

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const SYSTEM_PROMPT =
  "You are an expert L’Oréal product assistant. Only answer questions related to L’Oréal brands, products, beauty routines, shade matching, ingredients, application tips, or product availability. If a user asks about medical, legal, or non-beauty topics, or anything unrelated to L’Oréal, politely refuse and say: 'Sorry, I can only help with L’Oréal products, beauty routines, and recommendations.'";

const messageHistory = [];

chatWindow.textContent =
  "👋 Hello! Ask me about L’Oréal products, routines, and recommendations.";

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  if (messageHistory.length === 0) {
    chatWindow.innerHTML = "";
  }

  // Add user message to history and show it
  messageHistory.push({ role: "user", content: userMessage });
  chatWindow.innerHTML += `<div class="msg user"><strong>You:</strong> ${userMessage}</div>`;
  userInput.value = "";

  // Prepare messages for API (system + history)
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messageHistory,
  ];

  // Show spinner only
  const loaderDiv = document.createElement("div");
  loaderDiv.className = "msg ai";
  loaderDiv.innerHTML = `<span class="thinking-message"></span> <em>L'Oréal Bot is thinking...</em>`;
  chatWindow.appendChild(loaderDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const data = await response.json();

    loaderDiv.remove();

    // Get assistant's reply
    const reply = data.choices[0].message.content;
    if (
      reply.includes(
        "Sorry, I can only help with L’Oréal products, beauty routines, and recommendations."
      )
    ) {
      chatWindow.innerHTML += `<div class="msg ai"><strong>L'Oréal Bot:</strong> ${reply}</div>`;
    } else {
      chatWindow.innerHTML += `<div class="msg ai"><strong>L'Oréal Bot:</strong> ${reply}</div>`;
    }
    messageHistory.push({ role: "assistant", content: reply });
  } catch (err) {
    loaderDiv.remove();
    chatWindow.innerHTML += `<div class="msg ai error-message"><strong>Assistant:</strong> Sorry, there was an error.</div>`;
    console.error(err);
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  chatWindow.innerHTML =
    "👋 Hello! Ask me about L’Oréal products, routines, and recommendations.";
  messageHistory.length = 0;
});
