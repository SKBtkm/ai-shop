const chat = document.getElementById("chat");
const center = document.getElementById("center");
const input = document.getElementById("msg");

let language = "RU";

/* START SCREEN */
function start(lang) {
  language = lang;
  center.classList.add("hidden");
  addMessage(`Selected language: ${lang}`, "ai");
}

/* MESSAGE UI */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* SEND */
async function send() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "msg ai";
  loading.innerText = "typing...";
  chat.appendChild(loading);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        systemPrompt: `Language: ${language}. Always respond in this language.`
      })
    });

    const data = await res.json();

    loading.remove();
    addMessage(data.answer, "ai");

  } catch (e) {
    loading.remove();
    addMessage("error", "ai");
  }
}

/* ENTER SUPPORT */
function handleKey(e) {
  if (e.key === "Enter") {
    send();
  }
}
