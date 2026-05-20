const chat = document.getElementById("chat");

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // loading эффект
  const loading = document.createElement("div");
  loading.className = "msg ai";
  loading.innerText = "печатает...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    loading.remove();
    addMessage(data.answer || "нет ответа", "ai");

  } catch (e) {
    loading.remove();
    addMessage("ошибка сервера", "ai");
  }
}
